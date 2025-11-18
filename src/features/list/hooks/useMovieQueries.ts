import { useSuspenseQuery } from '@tanstack/react-query';
import { movieApi } from '@/entities/movie/api';
import { MovieListResponse } from '@/entities/movie/types';
import { MovieType } from '../constants/movieTypes';

type GetMovieQueryFn = (type: MovieType) => {
  queryKey: [string, MovieType];
  queryFn: () => Promise<MovieListResponse>;
  staleTime: number;
  gcTime: number;
};
const getMovieQuery: GetMovieQueryFn = (type) => {
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

type UseMovieQueryHook = (type: MovieType) => ReturnType<typeof useSuspenseQuery<MovieListResponse>>;
export const useMovieQuery: UseMovieQueryHook = (type) => {
  return useSuspenseQuery(getMovieQuery(type));
};
