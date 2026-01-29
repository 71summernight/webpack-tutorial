import { tmdbHttpClient } from './httpClient';

/**
 * 토큰 만료 시 자동 재로그인 interceptor
 * 401 Unauthorized 에러 발생 시 로그인 페이지로 이동
 */
type SetupAuthInterceptorFn = () => void;
const setupAuthInterceptor: SetupAuthInterceptorFn = () => {
  tmdbHttpClient.interceptors.response.use(
    (data) => data,
    (error) => {
      if (error instanceof Error && error.message.includes('HTTP 401')) {
        console.warn('Token expired. Redirecting to login...');
        // 로그인 페이지로 이동
        window.location.href = '/login';
      }
      throw error;
    },
  );
};

/**
 * 요청/응답 로깅 및 성능 모니터링 interceptor
 * 모든 API 요청의 시간을 측정하고 콘솔에 기록
 */
type SetupLoggingInterceptorFn = () => void;
const setupLoggingInterceptor: SetupLoggingInterceptorFn = () => {
  const isDev = import.meta.env.DEV;

  // 글로벌 요청 메타데이터 저장소
  const requestMetadata = new Map<string, { startTime: number; url: string; method: string; body?: any }>();

  // Request 시작 시간 기록 및 body 저장
  tmdbHttpClient.interceptors.request.use((config) => {
    const requestId = `${Date.now()}}`;
    const startTime = performance.now();

    // body가 있으면 파싱 (JSON 문자열이면 객체로 변환)
    let body = config.body;
    if (body && typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // JSON 파싱 실패 시 원본 사용
      }
    }

    requestMetadata.set(requestId, {
      startTime,
      url: config.url,
      method: config.method,
      body,
    });

    // 메타데이터에 requestId 저장
    if (!config.__metadata) {
      config.__metadata = {};
    }
    config.__metadata.requestId = requestId;

    return config;
  });

  // Response 시간 측정 및 로깅
  tmdbHttpClient.interceptors.response.use(
    (data) => {
      if (!isDev) return data;

      const lastRequestId = Array.from(requestMetadata.keys()).pop();

      if (lastRequestId) {
        const metadata = requestMetadata.get(lastRequestId);
        if (metadata) {
          const duration = performance.now() - metadata.startTime;
          const logMessage = `📥 ${metadata.method} ${metadata.url} (${duration.toFixed(2)}ms)`;

          // POST, PUT, PATCH는 body 함께 출력
          if (metadata.body && ['POST', 'PUT', 'PATCH'].includes(metadata.method)) {
            console.log(logMessage, metadata.body);
          } else {
            console.log(logMessage);
          }

          requestMetadata.delete(lastRequestId);
        }
      }

      return data;
    },
    (error) => {
      if (!isDev) throw error;

      const lastRequestId = Array.from(requestMetadata.keys()).pop();

      if (lastRequestId) {
        const metadata = requestMetadata.get(lastRequestId);
        if (metadata) {
          const duration = performance.now() - metadata.startTime;
          const errorMsg = error instanceof Error ? error.message : String(error);
          const logMessage = `❌ ${metadata.method} ${metadata.url} (${duration.toFixed(2)}ms)`;

          // POST, PUT, PATCH는 body 함께 출력
          if (metadata.body && ['POST', 'PUT', 'PATCH'].includes(metadata.method)) {
            console.error(logMessage, { body: metadata.body, error: errorMsg });
          } else {
            console.error(logMessage, errorMsg);
          }

          requestMetadata.delete(lastRequestId);
        }
      }

      throw error;
    },
  );
};

/**
 * 모든 interceptor 초기화
 * App 컴포넌트가 마운트될 때 호출
 */
type InitializeInterceptorsFn = () => void;
export const initializeInterceptors: InitializeInterceptorsFn = () => {
  setupAuthInterceptor();
  setupLoggingInterceptor();
};
