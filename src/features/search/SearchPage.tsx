import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import Loading from '@/shared/ui/Loading';
import { Suspense } from 'react';
import SearchPageContent from './components/SearchPageContent';

const SearchPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <SearchPageContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SearchPage;
