import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      // 에러 처리 추가
      throwOnError: false,
      // 네트워크 에러에 대한 재시도 로직
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 0,
      // mutation 에러 핸들링
      onError: (error) => {
        console.error('Mutation error:', error);
        // TODO: Toast notification or global error handler
      },
    },
  },
});
