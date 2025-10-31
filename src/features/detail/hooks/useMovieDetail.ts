import { useQuery } from '@tanstack/react-query';
import { movieApi } from '../../../entities/movie/api';
import { MovieDetail } from '../../../entities/movie/types';

export const useMovieDetail = (movieId: number | undefined) => {
  return useQuery<MovieDetail>({
    queryKey: ['movie', movieId],
    queryFn: () => movieApi.getMovieDetail(movieId!),
    enabled: movieId !== undefined,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
  });
};
