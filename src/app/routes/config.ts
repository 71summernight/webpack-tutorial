import { lazy } from 'react';

// 라우트 컴포넌트들을 동적으로 import
const ListPage = lazy(() => import('../../features/list/ListPage'));
const DetailPage = lazy(() => import('../../features/detail/DetailPage'));
const SearchPage = lazy(() => import('../../features/search/SearchPage'));

/**
 * 라우트 설정 (Single Source of Truth)
 * 이 객체를 수정하면 라우팅과 네비게이션이 자동 적용됩니다.
 */
export const routeConfig = {
  home: {
    id: 'home' as const,
    path: '/',
    title: 'Home',
    component: ListPage,
    link: () => '/',
  },
  search: {
    id: 'search' as const,
    path: '/search',
    title: 'Search',
    component: SearchPage,
    link: (query?: string) => {
      if (!query) return '/search';
      const params = new URLSearchParams({ query });
      return `/search?${params}`;
    },
  },
  detail: {
    id: 'detail' as const,
    path: '/detail/:id',
    title: 'Detail',
    component: DetailPage,
    link: (id: string) => {
      if (!id) {
        console.error('Detail page requires an id parameter');
        return '/'; // fallback 경로
      }
      return `/detail/${id}`;
    },
  },
} as const;

// appRoutes 배열 생성 (React Router 호환)
export const appRoutes = Object.values(routeConfig);

// 네비게이션 UI 등에 사용할 메타데이터
export const routeMetadata = appRoutes.map(({ id, path, title }) => ({
  id,
  path,
  title,
}));
