import { Movie } from '../../../entities/movie/types';
import { MovieCard } from '../../../entities/movie/ui/MovieCard';

interface MovieListProps {
  movies: Movie[] | undefined;
  type: 'popular' | 'now_playing' | 'top_rated' | 'upcoming';
}

export function MovieList({ movies, type }: MovieListProps) {
  if (!movies) return null;

  // 초기 뷰포트에 보이는 이미지들 (첫 12개)을 높은 우선순위로 설정
  const LCP_THRESHOLD = 12;

  return (
    <ul
      className="grid grid-cols-4 gap-4"
      style={{
        minHeight: '500px', // 최소 높이로 shift 방지
      }}
    >
      {movies.map(
        (movie, index) =>
          movie.poster_path && (
            <MovieCard
              key={movie.id}
              movie={movie}
              isPopular={type === 'popular' && index < 4}
              isLCP={index < LCP_THRESHOLD}
              index={index}
            />
          ),
      )}
    </ul>
  );
}
