import { tmdbHttpClient } from '../../../shared/api/httpClient';
import { MovieDetail, MovieGenreListResponse, MovieListResponse, SearchParams } from '../types';

export const movieApi = {
  // 인기 영화 목록
  getPopularMovies: (page: number = 1, language: string = 'ko-KR') =>
    tmdbHttpClient.get<MovieListResponse>('/movie/popular', {
      params: { page, language },
    }),

  // 현재 상영 중인 영화
  getNowPlayingMovies: (page: number = 1) =>
    tmdbHttpClient.get<MovieListResponse>('/movie/now_playing', {
      params: { page },
    }),

  // 높은 평점 영화
  getTopRatedMovies: (page: number = 1) =>
    tmdbHttpClient.get<MovieListResponse>('/movie/top_rated', {
      params: { page },
    }),

  // 개봉 예정 영화
  getUpcomingMovies: (page: number = 1) =>
    tmdbHttpClient.get<MovieListResponse>('/movie/upcoming', {
      params: { page },
    }),

  // 영화 상세 정보
  getMovieDetail: (movieId: number) => tmdbHttpClient.get<MovieDetail>(`/movie/${movieId}`),

  // 영화 검색
  searchMovies: (params: SearchParams) =>
    tmdbHttpClient.get<MovieListResponse>('/search/movie', {
      params,
    }),

  // 다중 검색 (영화, TV, 배우 등)
  multiSearch: (query: string, page: number = 1) =>
    tmdbHttpClient.get('/search/multi', {
      params: { query, page },
    }),
  // 영화 장르 목록
  getMovieGenres: (language: string = 'ko-KR') =>
    tmdbHttpClient.get<MovieGenreListResponse>('/genre/movie/list', {
      params: { language },
    }),
} as const;
