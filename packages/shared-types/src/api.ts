export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  stack?: string;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  cursor?: string | null;
  hasMore?: boolean;
}

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface FeedRequest extends PaginatedRequest {
  type: 'foryou' | 'latest' | 'local';
  districtId?: number;
  subDistrictId?: number;
}

export interface SearchRequest extends PaginatedRequest {
  q: string;
  type?: 'users' | 'posts' | 'hashtags' | 'communities' | 'all';
}
