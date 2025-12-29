import { tmdbHttpClient } from '@/shared/api/httpClient';
import {
  MovieDetail,
  MovieGenreListResponse,
  MovieListResponse,
  MovieReviewListResponse,
  SearchParams,
} from '../types';

type GetPopularMoviesFn = (page?: number, language?: string) => Promise<MovieListResponse>;
type GetNowPlayingMoviesFn = (page?: number) => Promise<MovieListResponse>;
type GetTopRatedMoviesFn = (page?: number) => Promise<MovieListResponse>;
type GetUpcomingMoviesFn = (page?: number) => Promise<MovieListResponse>;
type GetMovieDetailFn = (movieId: number) => Promise<MovieDetail>;
type GetMovieReviewsFn = (movieId: number) => Promise<MovieReviewListResponse>;
type SearchMoviesFn = (params: SearchParams) => Promise<MovieListResponse>;
type MultiSearchFn = (query: string, page?: number) => Promise<MovieListResponse>;
type GetMovieGenresFn = (language?: string) => Promise<MovieGenreListResponse>;

export const movieApi = {
  // 인기 영화 목록
  getPopularMovies: ((page = 1, language = 'ko-KR') =>
    tmdbHttpClient.get<MovieListResponse>('/movie/popular', {
      params: { page, language },
    })) as GetPopularMoviesFn,

  // 현재 상영 중인 영화
  getNowPlayingMovies: ((page = 1) =>
    tmdbHttpClient.get<MovieListResponse>('/movie/now_playing', {
      params: { page },
    })) as GetNowPlayingMoviesFn,

  // 높은 평점 영화
  getTopRatedMovies: ((page = 1) =>
    tmdbHttpClient.get<MovieListResponse>('/movie/top_rated', {
      params: { page },
    })) as GetTopRatedMoviesFn,

  // 개봉 예정 영화
  getUpcomingMovies: ((page = 1) =>
    tmdbHttpClient.get<MovieListResponse>('/movie/upcoming', {
      params: { page },
    })) as GetUpcomingMoviesFn,

  // 영화 상세 정보
  getMovieDetail: ((movieId) => tmdbHttpClient.get<MovieDetail>(`/movie/${movieId}`)) as GetMovieDetailFn,

  // 영화 검색
  searchMovies: ((params) =>
    tmdbHttpClient.get<MovieListResponse>('/search/movie', {
      params,
    })) as SearchMoviesFn,

  // 다중 검색 (영화, TV, 배우 등)
  multiSearch: ((query, page = 1) =>
    tmdbHttpClient.get('/search/multi', {
      params: { query, page },
    })) as MultiSearchFn,

  // 영화 장르 목록
  getMovieGenres: ((language = 'ko-KR') =>
    tmdbHttpClient.get<MovieGenreListResponse>('/genre/movie/list', {
      params: { language },
    })) as GetMovieGenresFn,

  // 영화 리뷰
  getMovieReviews: ((movieId) =>
    tmdbHttpClient.get<MovieReviewListResponse>(`/movie/${movieId}/reviews`, {
      params: { movieId, language: 'en-US' },
    })) as GetMovieReviewsFn,
} as const;
