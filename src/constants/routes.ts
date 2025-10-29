import { ListPage } from '../pages/list/ListPage';
import { DetailPage } from '../pages/detail/DetailPage';
import { SearchPage } from '../pages/search/SearchPage';

// 경로 상수
export const PAGES = {
  home: '/',
  search: '/search',
  detail: (id: string) => `/detail/${id}`,
} as const;

// 페이지 설정
export const pageConfig = [
  {
    path: PAGES.home,
    component: ListPage,
  },
  {
    path: PAGES.search,
    component: SearchPage,
  },
  {
    path: '/detail/:id',
    component: DetailPage,
  },
];
