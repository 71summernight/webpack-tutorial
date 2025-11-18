import { QueryClientProvider } from '@tanstack/react-query';
import React, { memo, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import Loading from '@/shared/ui/Loading';
import '../styles/reset.css';
import '../styles/tailwind.css';
import Header from '@/widgets/Header';
import { queryClient } from './config/queryClient';
import { routes } from './router';

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
              {routes.map((route) => (
                <Route key={route.id} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
