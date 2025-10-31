import { MovieSection } from './components/MovieSection';
import { useMovieQueries, type MovieType } from './hooks/useMovieQueries';

const MOVIE_TYPES: MovieType[] = ['popular', 'now_playing', 'top_rated', 'upcoming'];

export default function ListPage() {
  const results = useMovieQueries(MOVIE_TYPES);

  return (
    <div>
      {results.map((result, index) => (
        <MovieSection
          key={MOVIE_TYPES[index]}
          type={MOVIE_TYPES[index]}
          data={result.data}
          isLoading={result.isLoading}
          error={result.error as Error | null}
          refetch={result.refetch}
        />
      ))}
    </div>
  );
}
