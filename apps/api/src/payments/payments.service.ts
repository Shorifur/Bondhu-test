import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import type { CreatePaymentDto, VerifyPaymentDto, CreateEscrowDto } from './dto/payments.dto';
import { PaymentType, PaymentStatus, EscrowStatus, VerificationMethod } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async sendPayment(userId: string, dto: CreatePaymentDto) {
    // Verification gate required for all payments
    // In production: check if user recently verified via biometric/2FA

    const payment = await this.prisma.payment.create({
      data: {
        senderId: userId,
        receiverId: dto.receiverId,
        fundraiserId: dto.fundraiserId,
        type: dto.type,
        amount: dto.amount,
        provider: dto.provider,
        description: dto.description,
        status: 'PENDING',
      },
    });

    // Mock MFS processing
    await this.mockMfsProcessing(payment.id);

    return payment;
  }

  async requestFunds(userId: string, dto: CreatePaymentDto) {
    if (!dto.receiverId) throw new BadRequestException('Receiver required');
    return this.prisma.payment.create({
      data: {
        senderId: dto.receiverId,
        receiverId: userId,
        type: PaymentType.FUND_REQUEST,
        amount: dto.amount,
        provider: dto.provider,
        description: dto.description,
        status: 'PENDING',
      },
    });
  }

  async createEscrow(userId: string, dto: CreateEscrowDto) {
    const item = await this.prisma.marketplaceItem.findUnique({
      where: { id: dto.marketplaceItemId },
    });
    if (!item) throw new NotFoundException('Item not found');
    if (item.sellerId !== dto.sellerId) throw new BadRequestException('Seller mismatch');
    if (item.isSold) throw new BadRequestException('Item already sold');
    if (dto.amount !== Number(item.price)) throw new BadRequestException(`Escrow amount must match item price: ${item.price}`);

    const escrow = await this.prisma.escrow.create({
      data: {
        marketplaceItemId: dto.marketplaceItemId,
        buyerId: userId,
        sellerId: dto.sellerId,
        amount: dto.amount,
        status: 'PENDING',
      },
    });

    // Create payment record linked to escrow
    await this.prisma.payment.create({
      data: {
        senderId: userId,
        receiverId: dto.sellerId,
        type: PaymentType.ESCROW_LOCK,
        amount: dto.amount,
        provider: 'BKASH', // Default
        status: 'PENDING',
      },
    });

    return escrow;
  }

  async confirmEscrow(userId: string, escrowId: string, confirm: boolean) {
    const escrow = await this.prisma.escrow.findUnique({ where: { id: escrowId } });
    if (!escrow) throw new NotFoundException('Escrow not found');
    if (escrow.status === 'RELEASED') throw new BadRequestException('Escrow already released');
    if (escrow.status === 'CANCELLED') throw new BadRequestException('Escrow already cancelled');

    const isBuyer = escrow.buyerId === userId;
    const isSeller = escrow.sellerId === userId;
    if (!isBuyer && !isSeller) throw new ForbiddenException('Not authorized');

    if (!confirm) {
      // Either party can cancel by not confirming
      await this.prisma.escrow.update({
        where: { id: escrowId },
        data: { status: 'CANCELLED' },
      });
      return this.prisma.escrow.findUnique({ where: { id: escrowId } });
    }

    // Update the respective confirmation flag
    if (isBuyer) {
      await this.prisma.escrow.update({
        where: { id: escrowId },
        data: { buyerConfirmed: true },
      });
    } else if (isSeller) {
      await this.prisma.escrow.update({
        where: { id: escrowId },
        data: { sellerConfirmed: true },
      });
    }

    // Re-check escrow to see if both have confirmed
    const updated = await this.prisma.escrow.findUnique({ where: { id: escrowId } });
    if (updated?.buyerConfirmed && updated?.sellerConfirmed) {
      await this.prisma.escrow.update({
        where: { id: escrowId },
        data: { status: 'RELEASED', releasedAt: new Date() },
      });
      await this.prisma.marketplaceItem.update({
        where: { id: escrow.marketplaceItemId },
        data: { isSold: true },
      });
    }

    return this.prisma.escrow.findUnique({ where: { id: escrowId } });
  }

  async verifyPayment(userId: string, paymentId: string, dto: VerifyPaymentDto) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment || payment.senderId !== userId) throw new ForbiddenException('Not authorized');

    // Simulate verification
    if (dto.method === VerificationMethod.BIOMETRIC || dto.method === VerificationMethod.OTP_2FA) {
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: { verifiedVia: dto.method, status: 'PROCESSING' },
      });
      await this.mockMfsProcessing(paymentId);
    }

    return this.prisma.payment.findUnique({ where: { id: paymentId } });
  }

  async getHistory(userId: string, page = 1, limit = 20) {
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } }),
    ]);
    return { data: payments, meta: { page, limit, total } };
  }

  private async mockMfsProcessing(paymentId: string) {
    // In production: call bKash/Nagad API
    // Mock: complete after random delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'COMPLETED' },
    });
  }
}
