import { lazy, ComponentType } from 'react';
import { RouteObject } from 'react-router-dom';

/**
 * 네비게이션 경로 정의
 * 타입 안전성을 위해 상수로 관리
 */
export const PAGES = {
  home: '/',
  search: '/search',
  detail: (id: string) => `/detail/${id}`,
  settings: '/settings',
} as const;

/**
 * 페이지 컴포넌트 (Lazy Loading)
 */
const ListPage = lazy(() => import('../pages/list/ListPage').then((m) => ({ default: m.ListPage })));
const DetailPage = lazy(() => import('../pages/detail/DetailPage').then((m) => ({ default: m.DetailPage })));
const SearchPage = lazy(() => import('../pages/search/SearchPage').then((m) => ({ default: m.SearchPage })));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));

/**
 * 라우트 설정 인터페이스
 */
interface RouteConfig {
  path: string;
  component: ComponentType;
  title?: string;
  requiresAuth?: boolean;
}

/**
 * 라우트 설정 (Single Source of Truth)
 * 이 배열 하나만 수정하면 네비게이션, 라우팅 모두 자동 적용
 */
const routeConfigs: RouteConfig[] = [
  {
    path: PAGES.home,
    component: ListPage,
    title: 'Home',
  },
  {
    path: PAGES.search,
    component: SearchPage,
    title: 'Search',
  },
  {
    path: '/detail/:id',
    component: DetailPage,
    title: 'Detail',
  },
  {
    path: PAGES.settings,
    component: SettingsPage,
    title: 'Settings',
  },
];

/**
 * RouteObject 배열 생성
 * React Router에 전달할 형식으로 변환
 */
export const routes: RouteObject[] = routeConfigs.map((config, index) => {
  const Component = config.component;
  return {
    path: config.path,
    element: <Component />,
    id: `route-${config.path}-${index}`,
  };
});

/**
 * 라우트 메타데이터 (필요 시 네비게이션 UI 생성용)
 */
export const routeMetadata = routeConfigs.map((config, index) => ({
  path: config.path,
  title: config.title,
  id: `route-${config.path}-${index}`,
  requiresAuth: config.requiresAuth ?? false,
}));
