import { useQuery } from '@tanstack/react-query';
import { movieApi } from '../../../entities/movie/api';
import { MovieListResponse, SearchParams } from '../../../entities/movie/types';

export const useMovieSearch = (params: SearchParams | undefined) => {
  return useQuery<MovieListResponse>({
    queryKey: ['search-movies', params],
    queryFn: () => movieApi.searchMovies(params!),
    enabled: params?.query !== undefined && params.query !== '',
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};
