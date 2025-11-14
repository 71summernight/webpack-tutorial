import { PAGES } from '../../../app/routes/paths';
import { MovieCard } from '../../../entities/movie/ui/MovieCard';
import { getPosterUrl } from '../../../entities/movie/utils';
import { MovieType } from '../constants/movieTypes';
import { useMovieQuery } from '../hooks/useMovieQueries';

interface GridMovieSectionContentProps {
  type: MovieType;
}

export function GridMovieSectionContent({ type }: GridMovieSectionContentProps) {
  const { data } = useMovieQuery(type);
  if (!data?.results) return null;

  return (
    <ul
      className="grid grid-cols-4 gap-4"
      style={{
        minHeight: '500px',
      }}
    >
      {data.results.map((movie, index) => (
        <MovieCard
          key={movie.id}
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          width={290}
          height={163}
          to={PAGES.detail(movie.id)}
          index={index}
        />
      ))}
    </ul>
  );
}
