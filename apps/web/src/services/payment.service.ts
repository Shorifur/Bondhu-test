import { api } from '@/lib/api';
import type { Payment, Escrow } from '@bondhu/shared-types';

export const paymentService = {
  async send(data: {
    receiverId?: string;
    amount: number;
    provider: string;
    description?: string;
  }) {
    return api.post<Payment>('payments/send', { ...data, type: 'P2P_TRANSFER' });
  },

  async requestFunds(data: {
    receiverId: string;
    amount: number;
    provider: string;
    description?: string;
  }) {
    return api.post<Payment>('payments/request', { ...data, type: 'FUND_REQUEST' });
  },

  async createEscrow(data: {
    marketplaceItemId: string;
    sellerId: string;
    amount: number;
  }) {
    return api.post<Escrow>('payments/escrow', data);
  },

  async confirmEscrow(escrowId: string, confirm: boolean) {
    return api.post<{ status: string }>(`payments/escrow/${escrowId}/confirm`, { confirm });
  },

  async verify(paymentId: string, method: string, code?: string) {
    return api.post<Payment>(`payments/${paymentId}/verify`, { method, code });
  },

  async getHistory(page = 1, limit = 20) {
    return api.get<{ data: Payment[] }>(`payments/history?page=${page}&limit=${limit}`);
  },
};
