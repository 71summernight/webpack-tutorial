// Movie 엔티티 상수

export const MOVIE_CONSTANTS = {
  // 기본 포스터 이미지 (poster_path가 없을 때)
  DEFAULT_POSTER_IMAGE: '/images/defaultImage.avif',

  // TMDB 이미지 베이스 URL
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',

  // 포스터 이미지 크기
  POSTER_WIDTH: 290,
  POSTER_HEIGHT: 163,
} as const;
