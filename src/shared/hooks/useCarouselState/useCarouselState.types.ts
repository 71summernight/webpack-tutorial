export type UseCarouselStateOptions = {
  itemCount: number;
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  transitionDuration?: number;
};

export type UseCarouselStateReturn = {
  currentIndex: number;
  isTransitioning: boolean;
  moveNext: () => void;
  movePrev: () => void;
  moveTo: (index: number) => void;
  pageCount: number;
};

export type UseCarouselStateHook = (options: UseCarouselStateOptions) => UseCarouselStateReturn;
