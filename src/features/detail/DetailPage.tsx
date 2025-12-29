import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import Loading from '@/shared/ui/Loading';
import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import DetailMain from './components/DetailMain';
import { useMovieDetail } from './hooks/useMovieDetail';
import { useMovieReviews } from './hooks/useMovieReviews';

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number(id) : undefined;

  const { data: movie } = useMovieDetail(movieId);
  const { data: reviews } = useMovieReviews(movieId);

  if (!movie) return <div>영화를 찾을 수 없습니다.</div>;

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <DetailMain movie={movie} reviews={reviews} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DetailPage;
