import { Link } from 'react-router-dom';
import { LazyImage } from '../../../shared/components/LazyImage';
import { MOVIE_CONSTANTS } from '../constants';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isLCP?: boolean;
}

export function MovieCard({ movie, isLCP = false }: MovieCardProps) {
  const posterSrc = movie.poster_path
    ? `${MOVIE_CONSTANTS.TMDB_IMAGE_BASE_URL}/${movie.poster_path}`
    : MOVIE_CONSTANTS.DEFAULT_POSTER_IMAGE;

  return (
    <li>
      <Link to={`/detail/${movie.id}`}>
        <LazyImage
          src={posterSrc}
          alt={movie.title}
          width={MOVIE_CONSTANTS.POSTER_WIDTH}
          height={MOVIE_CONSTANTS.POSTER_HEIGHT}
          fetchPriority={isLCP ? 'high' : 'low'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Link>
    </li>
  );
}
