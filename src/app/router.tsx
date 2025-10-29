import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

// Suspense fallback으로 사용할 로딩 컴포넌트
const PageLoader = () => <div>Loading page...</div>;

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
] as const;

// React Router에 전달할 RouteObject 배열 자동 생성
export const routes: RouteObject[] = appRoutes.map((route) => {
  const Component = route.component;
  return {
    path: route.path,
    element: (
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    ),
    id: `route-${route.id}`,
  };
});

// 네비게이션 UI 등에 사용할 메타데이터 자동 생성
export const routeMetadata = appRoutes.map((route) => ({
  path: route.path,
  title: route.title,
  id: `route-${route.id}`,
}));
