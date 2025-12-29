import { useSuspenseQuery } from '@tanstack/react-query';
import { movieApi } from '@/entities/movie/api';
import { MovieDetail } from '@/entities/movie/types';

type UseMovieDetailHook = (movieId: number | undefined) => ReturnType<typeof useSuspenseQuery<MovieDetail>>;
export const useMovieDetail: UseMovieDetailHook = (movieId) => {
  return useSuspenseQuery<MovieDetail>({
    queryKey: ['movie', movieId],
    queryFn: () => movieApi.getMovieDetail(movieId!),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
