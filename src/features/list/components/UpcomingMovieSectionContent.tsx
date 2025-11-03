import { MovieCard } from '../../../entities/movie/ui/MovieCard';
import { MovieType } from '../constants/movieTypes';
import { useMovieQuery } from '../hooks/useMovieQueries';

export function UpcomingMovieSectionContent({ type }: { type: MovieType }) {
  const { data } = useMovieQuery(type);

  return (
    <ul
      className="grid grid-cols-4 gap-4"
      style={{
        minHeight: '500px',
      }}
    >
      {data.results.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} index={index} />
      ))}
    </ul>
  );
}
