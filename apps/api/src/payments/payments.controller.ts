import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreatePaymentDto, VerifyPaymentDto, CreateEscrowDto } from './dto/payments.dto';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send P2P payment' })
  async sendPayment(@CurrentUser('id') userId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.sendPayment(userId, dto);
  }

  @Post('request')
  @ApiOperation({ summary: 'Request funds' })
  async requestFunds(@CurrentUser('id') userId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.requestFunds(userId, dto);
  }

  @Post('escrow')
  @ApiOperation({ summary: 'Create escrow' })
  async createEscrow(@CurrentUser('id') userId: string, @Body() dto: CreateEscrowDto) {
    return this.paymentsService.createEscrow(userId, dto);
  }

  @Post('escrow/:id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm escrow delivery' })
  async confirmEscrow(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body('confirm') confirm: boolean,
  ) {
    return this.paymentsService.confirmEscrow(userId, id, confirm);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify payment with biometric/2FA' })
  async verifyPayment(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: VerifyPaymentDto,
  ) {
    return this.paymentsService.verifyPayment(userId, id, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Payment history' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getHistory(@CurrentUser('id') userId: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.paymentsService.getHistory(userId, Number(page) || 1, Number(limit) || 20);
  }
}
