import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import Loading from '@/shared/ui/Loading';
import { Suspense } from 'react';
import DetailMain from './components/DetailMain';

const DetailPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <DetailMain />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DetailPage;
