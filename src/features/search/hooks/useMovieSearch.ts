import { useSuspenseQuery } from '@tanstack/react-query';
import { movieApi } from '@/entities/movie/api';
import { MovieListResponse, SearchParams } from '@/entities/movie/types';

type UseMovieSearchHook = (params: SearchParams | undefined) => ReturnType<typeof useSuspenseQuery<MovieListResponse>>;
export const useMovieSearch: UseMovieSearchHook = (params) => {
  return useSuspenseQuery<MovieListResponse>({
    queryKey: ['search-movies', params],
    queryFn: () => movieApi.searchMovies(params!),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
