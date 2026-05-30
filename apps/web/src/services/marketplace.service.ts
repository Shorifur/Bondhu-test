import { api } from '@/lib/api';
import type { MarketplaceItem } from '@bondhu/shared-types';

export const marketplaceService = {
  async browse(params: {
    category?: string;
    districtId?: number;
    minPrice?: number;
    maxPrice?: number;
    verifiedOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) query.set(k, String(v));
    });
    return api.get<{ data: MarketplaceItem[]; meta: { page: number; limit: number; total: number } }>(
      `marketplace/items?${query.toString()}`,
    );
  },

  async getById(id: string) {
    return api.get<MarketplaceItem>(`marketplace/items/${id}`);
  },

  async create(data: {
    title: string;
    description: string;
    price: number;
    condition: string;
    category: string;
    districtId?: number;
    subDistrictId?: number;
    isNegotiable?: boolean;
  }) {
    return api.post<MarketplaceItem>('marketplace/items', data);
  },

  async update(id: string, data: Partial<MarketplaceItem>) {
    return api.patch<MarketplaceItem>(`marketplace/items/${id}`, data);
  },

  async delete(id: string) {
    return api.delete(`marketplace/items/${id}`);
  },

  async search(query: string, page = 1, limit = 20) {
    return api.get<{ data: MarketplaceItem[]; meta: { page: number; limit: number; total: number } }>(
      `marketplace/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    );
  },
};
