import { Link } from 'react-router-dom';
import { LazyImage } from '../../../shared/components/LazyImage';
import { MOVIE_CONSTANTS } from '../constants';
import { Movie } from '../types';
import { PopularBadge } from './PopularBadge';

interface MovieCardProps {
  movie: Movie;
  isPopular?: boolean;
  index: number;
}

export function MovieCard({ movie, isPopular = false, index }: MovieCardProps) {
  const posterSrc = movie.poster_path
    ? `${MOVIE_CONSTANTS.TMDB_IMAGE_BASE_URL}/${movie.poster_path}`
    : MOVIE_CONSTANTS.DEFAULT_POSTER_IMAGE;

  // 처음 4개 이미지만 높은 우선순위로 로드
  const fetchPriority = index < 4 ? 'high' : 'low';

  return (
    <li className="relative">
      <Link to={`/detail/${movie.id}`} className="relative block">
        {isPopular && <PopularBadge index={index} />}
        <LazyImage
          src={posterSrc}
          alt={movie.title}
          width={MOVIE_CONSTANTS.POSTER_WIDTH}
          height={MOVIE_CONSTANTS.POSTER_HEIGHT}
          fetchPriority={fetchPriority}
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
