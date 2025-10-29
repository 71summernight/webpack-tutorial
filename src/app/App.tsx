import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense, memo } from 'react';
import { routes } from './router';
import { queryClient } from './config/queryClient';
import { ErrorBoundary } from '../components/ErrorBoundary';
import '../style/reset.css';
import Header from '../components/Header';

const LoadingFallback = memo(() => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <p>Loading...</p>
  </div>
));
LoadingFallback.displayName = 'LoadingFallback';

const ErrorFallback = memo(() => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <p>Something went wrong. Please try refreshing the page.</p>
  </div>
));
ErrorFallback.displayName = 'ErrorFallback';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Suspense fallback={<LoadingFallback />}>
            <Header />
            <Routes>
              {routes.map((route) => (
                <Route key={route.id} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
