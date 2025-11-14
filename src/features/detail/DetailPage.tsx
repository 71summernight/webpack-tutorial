import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';
import Loading from '../../shared/ui/Loading';
import { useMovieDetail } from './hooks/useMovieDetail';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number(id) : undefined;

  const { data: movie } = useMovieDetail(movieId);

  if (!movie) return <div>영화를 찾을 수 없습니다.</div>;
  console.log(movie);
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <div>
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <p>{movie.release_date}</p>
          <p>{movie.runtime}</p>
          <p>{movie.vote_average}</p>
          <p>{movie.vote_count}</p>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}
