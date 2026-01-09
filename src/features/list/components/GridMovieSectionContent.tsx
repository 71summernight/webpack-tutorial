import { PAGES } from '@/app/routes/paths';
import { MovieCard } from '@/entities/movie/ui/MovieCard';
import { getPosterUrl } from '@/entities/movie/utils';
import { MovieType } from '../constants/movieTypes';
import { useMovieQuery } from '../hooks/useMovieQueries';

type GridMovieSectionContentProps = {
  type: MovieType;
};

export const GridMovieSectionContent = ({ type }: GridMovieSectionContentProps) => {
  const { data } = useMovieQuery(type);
  const movies = data?.results ?? [];
  if (!data?.results) return null;

  return (
    <ul className="grid grid-cols-4 gap-4">
      {movies.map((movie, rank) => (
        <MovieCard
          key={movie.id}
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          to={PAGES.detail(movie.id)}
          variant="medium"
          rank={rank}
        />
      ))}
    </ul>
  );
};
