import { TMDB_BASE_URL, TMDB_TIMEOUT, TMDB_TOKEN } from './constants';

interface FetchOptions {
  params?: Record<string, any>;
  body?: any;
  timeout?: number;
}

const buildUrl = (baseUrl: string, endpoint: string, params?: Record<string, any>): string => {
  const fullPath = `${baseUrl}${endpoint}`;
  const url = new URL(fullPath);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

const buildHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    accept: 'application/json',
  };

  // 토큰이 있으면 Authorization 헤더에 추가
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const request = async <T>(
  method: string,
  endpoint: string,
  baseUrl: string,
  token: string | undefined,
  options: FetchOptions = {},
): Promise<T> => {
  const url = buildUrl(baseUrl, endpoint, options.params);
  const timeout = options.timeout ?? TMDB_TIMEOUT;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchOptions: RequestInit = {
    method,
    headers: buildHeaders(token),
    signal: controller.signal,
  };

  // POST, PUT, PATCH는 body 포함
  if (method !== 'GET' && method !== 'DELETE' && options.body) {
    (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      const error = await response.json().catch(() => ({}));
      throw new Error(error.status_message || `HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof TypeError) {
      console.error('Network error:', error.message);
      throw new Error('네트워크 요청 실패');
    }

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout');
      throw new Error('요청 타임아웃');
    }

    throw error;
  }
};

export const tmdbHttpClient = {
  get: <T>(endpoint: string, options?: FetchOptions): Promise<T> =>
    request<T>('GET', endpoint, TMDB_BASE_URL, TMDB_TOKEN, options),

  post: <T>(endpoint: string, options?: FetchOptions): Promise<T> =>
    request<T>('POST', endpoint, TMDB_BASE_URL, TMDB_TOKEN, options),

  put: <T>(endpoint: string, options?: FetchOptions): Promise<T> =>
    request<T>('PUT', endpoint, TMDB_BASE_URL, TMDB_TOKEN, options),

  delete: <T>(endpoint: string, options?: FetchOptions): Promise<T> =>
    request<T>('DELETE', endpoint, TMDB_BASE_URL, TMDB_TOKEN, options),

  patch: <T>(endpoint: string, options?: FetchOptions): Promise<T> =>
    request<T>('PATCH', endpoint, TMDB_BASE_URL, TMDB_TOKEN, options),
};
