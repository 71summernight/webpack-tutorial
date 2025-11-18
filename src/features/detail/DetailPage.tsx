import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import Loading from '@/shared/ui/Loading';
import DetailMain from './components/DetailMain';
import { useMovieDetail } from './hooks/useMovieDetail';

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number(id) : undefined;

  const { data: movie } = useMovieDetail(movieId);

  if (!movie) return <div>영화를 찾을 수 없습니다.</div>;
  console.log(movie);
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <DetailMain movie={movie} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DetailPage;
