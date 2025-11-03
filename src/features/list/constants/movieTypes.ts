export const MOVIE_TYPES = ['popular', 'now_playing', 'top_rated', 'upcoming'] as const;

export type MovieType = (typeof MOVIE_TYPES)[number];

export const MOVIE_TYPE_LABELS: Record<MovieType, string> = {
  popular: '인기',
  now_playing: '현재상영',
  top_rated: '높은평점',
  upcoming: '개봉예정',
};
