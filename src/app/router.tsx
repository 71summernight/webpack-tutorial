import { RouteObject } from 'react-router-dom';
import { pageConfig } from '../constants/routes';

// 동적 라우트 생성
export const routes: RouteObject[] = pageConfig.map((page) => ({
  path: page.path,
  element: <page.component />,
}));
