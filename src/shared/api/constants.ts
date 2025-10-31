// API 상수
const validateEnv = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`필수 환경변수 ${key}가 설정되지 않았습니다`);
  }
  return value;
};

export const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
export const TMDB_TOKEN = validateEnv('TMDB_API_TOKEN', process.env.TMDB_API_TOKEN);
export const TMDB_TIMEOUT = 5000; // 5초
