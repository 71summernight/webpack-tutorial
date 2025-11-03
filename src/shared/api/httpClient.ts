import { TMDB_BASE_URL, TMDB_TIMEOUT, TMDB_TOKEN } from './constants';

interface FetchOptions {
  params?: Record<string, any>;
  body?: any;
  timeout?: number;
}

interface RequestInterceptor {
  (config: RequestConfig): RequestConfig | Promise<RequestConfig>;
}

interface ResponseInterceptor<T> {
  (response: T): T | Promise<T>;
}

interface ErrorInterceptor {
  (error: Error): Error | Promise<Error>;
}

interface RequestConfig {
  url: string;
  method: string;
  headers: HeadersInit;
  body?: any;
  signal: AbortSignal;
  __metadata?: {
    startTime?: number;
    requestId?: string;
  };
}

interface HttpClientInstance {
  get: <T>(endpoint: string, options?: FetchOptions) => Promise<T>;
  post: <T>(endpoint: string, options?: FetchOptions) => Promise<T>;
  put: <T>(endpoint: string, options?: FetchOptions) => Promise<T>;
  delete: <T>(endpoint: string, options?: FetchOptions) => Promise<T>;
  patch: <T>(endpoint: string, options?: FetchOptions) => Promise<T>;
  interceptors: {
    request: {
      use: (onFulfilled: RequestInterceptor, onRejected?: ErrorInterceptor) => void;
    };
    response: {
      use: <T>(onFulfilled: ResponseInterceptor<T>, onRejected?: ErrorInterceptor) => void;
    };
  };
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

const createHttpClient = (baseUrl: string, token: string | undefined): HttpClientInstance => {
  const requestInterceptors: Array<[RequestInterceptor, ErrorInterceptor | undefined]> = [];
  const responseInterceptors: Array<[ResponseInterceptor<any>, ErrorInterceptor | undefined]> = [];

  const request = async <T>(method: string, endpoint: string, options: FetchOptions = {}): Promise<T> => {
    const url = buildUrl(baseUrl, endpoint, options.params);
    const timeout = options.timeout ?? TMDB_TIMEOUT;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let config: RequestConfig = {
      url,
      method,
      headers: buildHeaders(token),
      signal: controller.signal,
    };

    // POST, PUT, PATCH는 body 포함
    if (method !== 'GET' && method !== 'DELETE' && options.body) {
      (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
      config.body = JSON.stringify(options.body);
    }

    // Request interceptors 실행
    try {
      for (const [onFulfilled] of requestInterceptors) {
        config = await onFulfilled(config);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        signal: config.signal,
        body: config.body,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        const error = await response.json().catch(() => ({}));
        throw new Error(error.status_message || `HTTP ${response.status}`);
      }

      let data = (await response.json()) as T;

      // Response interceptors 실행
      for (const [onFulfilled] of responseInterceptors) {
        data = await onFulfilled(data);
      }

      return data;
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

  return {
    get: <T>(endpoint: string, options?: FetchOptions): Promise<T> => request<T>('GET', endpoint, options),

    post: <T>(endpoint: string, options?: FetchOptions): Promise<T> => request<T>('POST', endpoint, options),

    put: <T>(endpoint: string, options?: FetchOptions): Promise<T> => request<T>('PUT', endpoint, options),

    delete: <T>(endpoint: string, options?: FetchOptions): Promise<T> => request<T>('DELETE', endpoint, options),

    patch: <T>(endpoint: string, options?: FetchOptions): Promise<T> => request<T>('PATCH', endpoint, options),

    interceptors: {
      request: {
        use: (onFulfilled: RequestInterceptor, onRejected?: ErrorInterceptor) => {
          requestInterceptors.push([onFulfilled, onRejected]);
        },
      },
      response: {
        use: <T>(onFulfilled: ResponseInterceptor<T>, onRejected?: ErrorInterceptor) => {
          responseInterceptors.push([onFulfilled, onRejected]);
        },
      },
    },
  };
};

export const tmdbHttpClient = createHttpClient(TMDB_BASE_URL, TMDB_TOKEN);
