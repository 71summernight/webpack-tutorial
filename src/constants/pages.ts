import { appRoutes } from '../app/router';

/**
 * 네비게이션 경로 상수
 * appRoutes에서 자동으로 생성됩니다.
 */

type PageLinks = {
  [K in (typeof appRoutes)[number]['id']]: Extract<(typeof appRoutes)[number], { id: K }>['link'];
};

export const PAGES = Object.fromEntries(appRoutes.map((route) => [route.id, route.link])) as PageLinks;
