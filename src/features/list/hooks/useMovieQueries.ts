import { useSuspenseQuery } from '@tanstack/react-query';
import { movieApi } from '../../../entities/movie/api';
import { MovieListResponse } from '../../../entities/movie/types';
import { MovieType } from '../constants/movieTypes';

const getMovieQuery = (type: MovieType) => {
  const apiMethods: Record<MovieType, () => Promise<MovieListResponse>> = {
    popular: () => movieApi.getPopularMovies(),
    now_playing: () => movieApi.getNowPlayingMovies(),
    top_rated: () => movieApi.getTopRatedMovies(),
    upcoming: () => movieApi.getUpcomingMovies(),
  };

  return {
    queryKey: ['movies', type],
    queryFn: apiMethods[type],
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  };
};

export function useMovieQuery(type: MovieType) {
  return useSuspenseQuery(getMovieQuery(type));
}
