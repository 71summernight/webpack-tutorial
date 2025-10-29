import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Default 로딩 컴포넌트
const PageLoader = () => <div>Loading page...</div>;

// Default 에러 컴포넌트
const ErrorFallback = () => <div>Something went wrong. Please try again.</div>;

/**
 * 라우트 설정 (Single Source of Truth)
 * 이 배열을 수정하면 라우팅과 네비게이션이 자동 적용됩니다.
 */
export const appRoutes = [
  {
    id: 'home' as const,
    path: '/',
    title: 'Home',
    component: lazy(() => import('../pages/list/ListPage').then((m) => ({ default: m.ListPage }))),
    link: () => '/',
  },
  {
    id: 'search' as const,
    path: '/search',
    title: 'Search',
    component: lazy(() => import('../pages/search/SearchPage').then((m) => ({ default: m.SearchPage }))),
    link: () => '/search',
  },
  {
    id: 'detail' as const,
    path: '/detail/:id',
    title: 'Detail',
    component: lazy(() => import('../pages/detail/DetailPage').then((m) => ({ default: m.DetailPage }))),
    link: (id: string) => `/detail/${id}`,
  },
  {
    id: 'settings' as const,
    path: '/settings',
    title: 'Settings',
    component: lazy(() => import('../pages/settings/SettingsPage').then((m) => ({ default: m.SettingsPage }))),
    link: () => '/settings',
  },
] as const;

// React Router에 전달할 RouteObject 배열 자동 생성
// 모든 페이지에 default ErrorBoundary와 Suspense 적용
export const routes: RouteObject[] = appRoutes.map((route) => {
  const Component = route.component;
  return {
    path: route.path,
    element: (
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<PageLoader />}>
          <Component />
        </Suspense>
      </ErrorBoundary>
    ),
    id: `route-${route.id}`,
  };
});

// 네비게이션 UI 등에 사용할 메타데이터 자동 생성
export const routeMetadata = appRoutes.map(({ id, path, title }) => ({
  id,
  path,
  title,
}));
