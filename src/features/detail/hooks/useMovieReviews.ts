import { movieApi } from '@/entities/movie/api';
import { MovieReviewListResponse } from '@/entities/movie/types';
import { useSuspenseQuery } from '@tanstack/react-query';

type UseMovieReviewsHook = (
  movieId: number | undefined,
) => ReturnType<typeof useSuspenseQuery<MovieReviewListResponse>>;
export const useMovieReviews: UseMovieReviewsHook = (movieId) => {
  return useSuspenseQuery<MovieReviewListResponse>({
    queryKey: ['movie', movieId, 'reviews'],
    queryFn: () => movieApi.getMovieReviews(movieId!),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
