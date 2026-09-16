import { RequestOptions, ApiError } from './api.types';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';
const CACHE_PREFIX = 'locus_cache:';

interface CacheItem<T> {
  timestamp: number;
  endpoint: string;
  data: T;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private getCacheKey(url: string): string {
    return `${CACHE_PREFIX}GET:${url}`;
  }

  private getFromCache<T>(key: string): T | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const parsed: CacheItem<T> = JSON.parse(raw);
      return parsed.data;
    } catch {
      return null;
    }
  }

  private saveToCache<T>(key: string, endpoint: string, data: T): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const item: CacheItem<T> = {
        timestamp: Date.now(),
        endpoint,
        data,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch {
      // If quota exceeded or storage blocked, clean up old locus_cache keys
      this.clearCache();
      try {
        localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), endpoint, data }));
      } catch {}
    }
  }

  /**
   * Invalidates cached entries in localStorage matching an optional domain keyword,
   * or all cache entries if no domain is specified.
   */
  public invalidateCache(domainOrKeyword?: string): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          if (!domainOrKeyword || key.toLowerCase().includes(domainOrKeyword.toLowerCase())) {
            keysToRemove.push(key);
          }
        }
      }

      keysToRemove.forEach((k) => localStorage.removeItem(k));
      window.dispatchEvent(
        new CustomEvent('locus:cache-invalidated', { detail: { domain: domainOrKeyword } })
      );
    } catch {}
  }

  /**
   * Completely clears all locus_cache entries in localStorage.
   */
  public clearCache(): void {
    this.invalidateCache();
  }

  /**
   * Handles cache invalidation whenever a mutation (POST, PUT, DELETE) occurs.
   */
  private handleMutationCacheInvalidation(endpoint: string): void {
    const clean = endpoint.toLowerCase();
    if (clean.includes('patient')) {
      // Patients change affects patients list, patient details, and visits/appointments
      this.invalidateCache('patient');
      this.invalidateCache('visit');
    } else if (clean.includes('visit')) {
      // Visits change affects visits list, patient details visits, and dashboard stats
      this.invalidateCache('visit');
      this.invalidateCache('patient');
    } else if (clean.includes('test')) {
      // Tests change affects test catalog and test selector
      this.invalidateCache('test');
      this.invalidateCache('visit');
    } else {
      // Any other action invalidates full cache
      this.invalidateCache();
    }
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, skipCache = false, ...restOptions } = options;
    const method = (restOptions.method || 'GET').toUpperCase();
    const url = this.buildUrl(endpoint, params);
    const cacheKey = this.getCacheKey(url);

    // 1. Return from LocalStorage cache for GET requests if available
    if (method === 'GET' && !skipCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached !== null && cached !== undefined) {
        return cached;
      }
    }

    // 2. Network Fetch
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    try {
      const response = await fetch(url, {
        headers: {
          ...defaultHeaders,
          ...headers,
        },
        ...restOptions,
      });

      if (!response.ok) {
        let errorDetail: any;
        try {
          errorDetail = await response.json();
        } catch {
          errorDetail = await response.text();
        }

        const error = new Error(errorDetail?.detail || response.statusText || 'API request failed') as Error & ApiError;
        error.status = response.status;
        error.detail = errorDetail;
        throw error;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        if (method !== 'GET') {
          this.handleMutationCacheInvalidation(endpoint);
        }
        return null as unknown as T;
      }

      const data = (await response.json()) as T;

      // 3. Cache GET responses in LocalStorage
      if (method === 'GET') {
        this.saveToCache(cacheKey, endpoint, data);
      } else {
        // 4. Invalidate cache on mutations (POST, PUT, DELETE)
        this.handleMutationCacheInvalidation(endpoint);
      }

      return data;
    } catch (err: any) {
      if (err.status) {
        throw err;
      }
      const customError = new Error(err.message || 'Network error or connection refused') as Error & ApiError;
      customError.status = 0;
      throw customError;
    }
  }

  public get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>,
    options?: { skipCache?: boolean }
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params, skipCache: options?.skipCache });
  }

  public post<T>(
    endpoint: string,
    body?: any,
    params?: Record<string, string | number | boolean | undefined | null>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      params,
    });
  }

  public put<T>(
    endpoint: string,
    body?: any,
    params?: Record<string, string | number | boolean | undefined | null>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      params,
    });
  }

  public delete<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', params });
  }
}

export const api = new ApiClient(BASE_URL);
export default api;
