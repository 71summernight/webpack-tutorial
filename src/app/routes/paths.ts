export const PATHS = {
  HOME: '/',
  SEARCH: '/search',
  DETAIL: '/detail/:id',
} as const;

export const PAGES = {
  home: () => '/',
  search: (query?: string) => (query ? `/search?query=${query}` : '/search'),
  detail: (id: string | number) => `/detail/${id}`,
} as const;
