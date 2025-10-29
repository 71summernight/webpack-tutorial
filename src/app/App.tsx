import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { routes } from './router';
import { queryClient } from './config/queryClient';

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <p>Loading...</p>
  </div>
);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {routes.map((route) => (
              <Route key={route.id} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
