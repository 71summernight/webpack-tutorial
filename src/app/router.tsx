import { RouteObject } from 'react-router-dom';
import { appRoutes } from './routes/config';

/**
 * React Router에 전달할 RouteObject 배열
 * ErrorBoundary와 Suspense는 App 레벨에서 한 번만 적용
 */
export const routes: RouteObject[] = appRoutes.map((route) => ({
  path: route.path,
  element: <route.component />,
  id: `route-${route.id}`,
}));
