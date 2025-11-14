import { useSuspenseQuery } from '@tanstack/react-query';
import { movieApi } from '../api';

export function useMovieGenres() {
  return useSuspenseQuery({
    queryKey: ['movies', 'genres'],
    queryFn: () => movieApi.getMovieGenres(),
    staleTime: 24 * 60 * 60 * 1000, // 24시간 (장르는 거의 변하지 않음)
    gcTime: 24 * 60 * 60 * 1000,
  });
}
