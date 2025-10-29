import { routeConfig } from './config';

/**
 * 네비게이션 경로 생성 함수
 * 타입 안전성과 런타임 안전성을 제공합니다.
 *
 * 사용 예시:
 * - PAGES.home() → '/'
 * - PAGES.search() → '/search'
 * - PAGES.detail('123') → '/detail/123'
 */

export const PAGES = {
  home: () => routeConfig.home.path,
  search: () => routeConfig.search.path,
  detail: (id: string) => {
    if (!id) throw new Error('Detail page requires an id parameter');
    return routeConfig.detail.path.replace(':id', id);
  },
} as const;
