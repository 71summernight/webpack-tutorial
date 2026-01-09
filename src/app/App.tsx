import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, memo, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import Loading from '@/shared/ui/Loading';
import Header from '@/widgets/Header';
import '../styles/reset.css';
import '../styles/tailwind.css';
import { queryClient } from './config/queryClient';
import { PATHS } from './routes/paths';

const ListPage = lazy(() => import('@/features/list/ListPage'));
const DetailPage = lazy(() => import('@/features/detail/DetailPage'));
const SearchPage = lazy(() => import('@/features/search/SearchPage'));

const ErrorFallback = memo(() => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <p>Something went wrong. Please try refreshing the page.</p>
  </div>
));
ErrorFallback.displayName = 'ErrorFallback';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Header />
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path={PATHS.HOME} element={<ListPage />} />
              <Route path={PATHS.SEARCH} element={<SearchPage />} />
              <Route path={PATHS.DETAIL} element={<DetailPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
