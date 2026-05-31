import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: Record<string, string[]> };
  meta?: { page?: number; limit?: number; total?: number; hasMore?: boolean; cursor?: string | null };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      setCookie('bondhu_token', token, { maxAge: 60 * 60 * 24 * 7, path: '/' });
    } else {
      deleteCookie('bondhu_token', { path: '/' });
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && !this.token) {
      this.token = getCookie('bondhu_token') as string | null;
    }
    return this.token;
  }

  private async request<T>(method: string, path: string, body?: unknown, opts?: RequestInit & { silent?: boolean }): Promise<ApiResponse<T>> {
    const { silent, ...fetchOpts } = opts || {};
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((fetchOpts?.headers as Record<string, string>) || {}),
    };

    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const res = await fetch(`${this.baseUrl}/v1${normalizedPath}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...fetchOpts,
    });

    // Silent mode: return empty success on 404 (backend route not ready)
    if (silent && res.status === 404) {
      return { success: true, data: null as T };
    }

    const data = await res.json().catch(() => ({ success: false, error: { code: 'PARSE_ERROR', message: 'Invalid JSON' } }));

    if (!res.ok) {
      const error = data.error || { code: `HTTP_${res.status}`, message: 'Request failed' };
      throw new ApiError(error.code, error.message, error.details);
    }

    return data as ApiResponse<T>;
  }

  get<T>(path: string, opts?: RequestInit) {
    return this.request<T>('GET', path, undefined, opts);
  }

  post<T>(path: string, body?: unknown, opts?: RequestInit) {
    return this.request<T>('POST', path, body, opts);
  }

  patch<T>(path: string, body?: unknown, opts?: RequestInit) {
    return this.request<T>('PATCH', path, body, opts);
  }

  delete<T>(path: string, opts?: RequestInit) {
    return this.request<T>('DELETE', path, undefined, opts);
  }
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient(API_BASE);
