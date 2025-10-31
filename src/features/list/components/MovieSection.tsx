import { MovieListResponse } from '../../../entities/movie/types';
import Error from '../../../shared/ui/Error';
import Loading from '../../../shared/ui/Loading';
import { MOVIE_TYPE_LABELS } from '../constants/movieTypeLabels';

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
    <>
      <h2 className="font-bold text-white my-4 bg-primary px-4 py-2  my-5 rounded-lg w-fit ">
        {MOVIE_TYPE_LABELS[type]}
      </h2>
      <section>
        {isLoading && <Loading />}
        {error && <Error error={error} onRetry={refetch} />}
        {!isLoading && !error && <MovieList movies={data?.results} type={type} />}
      </section>
    </>
  );
}
