import { appRoutes } from './config';

/**
 * 네비게이션 경로 생성 함수
 * routeConfig에서 자동으로 생성되므로 동기화 문제 없음
 *
 * 사용 예시:
 * - PAGES.home() → '/'
 * - PAGES.search() → '/search'
 * - PAGES.detail('123') → '/detail/123'
 */

type RouteId = (typeof appRoutes)[number]['id'];
type RouteParams<T extends RouteId> = T extends 'detail' ? [id: string] : [];

// 라우트 설정에서 link 함수를 자동으로 추출하여 PAGES 생성
export const PAGES = Object.fromEntries(
  appRoutes.map((route) => [
    route.id,
    (...args: any[]) => {
      if (typeof route.link === 'function') {
        return (route.link as any)(...args);
      }
      return route.path;
    },
  ]),
) as Record<RouteId, (...args: any[]) => string>;
