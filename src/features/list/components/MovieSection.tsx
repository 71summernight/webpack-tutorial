import { MovieListResponse } from '../../../entities/movie/types';
import Error from '../../../shared/ui/Error';
import Loading from '../../../shared/ui/Loading';

import { MovieList } from './MovieList';

interface MovieSectionProps {
  type: 'popular' | 'now_playing' | 'top_rated' | 'upcoming';
  data?: MovieListResponse;
  isLoading?: boolean;
  error?: Error | null;
  refetch?: () => void;
}

export function MovieSection({ type, data, isLoading, error, refetch }: MovieSectionProps) {
  return (
    <section>
      <h1 className="text-2xl font-bold text-white my-4 bg-primary p-4 rounded-lg">{type}</h1>
      {isLoading && <Loading />}
      {error && <Error error={error} onRetry={refetch} />}
      {!isLoading && !error && <MovieList movies={data?.results} />}
    </section>
  );
}
