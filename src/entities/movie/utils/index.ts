import { MOVIE_CONSTANTS } from '../constants';
import { Genre } from '../types';

/**
 * 장르 ID로 장르 이름 찾기
 * @param genres - 전체 장르 목록
 * @param genreId - 찾을 장르 ID
 * @returns 장르 이름 또는 undefined
 */
export function getGenreName(genres: Genre[], genreId: number): string | undefined {
  return genres.find((genre) => genre.id === genreId)?.name;
}

/**
 * 장르 ID 배열을 장르 이름 문자열로 변환
 * @param genres - 전체 장르 목록
 * @param genreIds - 장르 ID 배열
 * @param separator - 구분자 (기본: ', ')
 * @returns 장르 이름들을 구분자로 연결한 문자열
 */
export function getGenreNames(genres: Genre[], genreIds: number[] = [], separator: string = ', '): string {
  return genreIds
    .map((id) => getGenreName(genres, id))
    .filter(Boolean)
    .join(separator);
}

/**
 * 영화 포스터 URL 생성
 * @param posterPath - TMDB API에서 받은 poster_path (null 가능)
 * @returns 완성된 포스터 URL 또는 기본 이미지
 */
export function getPosterUrl(posterPath: string | null): string {
  return posterPath ? `${MOVIE_CONSTANTS.TMDB_IMAGE_BASE_URL}/${posterPath}` : MOVIE_CONSTANTS.DEFAULT_POSTER_IMAGE;
}
