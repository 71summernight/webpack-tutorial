import { ReactNode } from 'react';

// Carousel (내부 컴포넌트) - 아이템 렌더링 + 네비게이션 버튼
// currentIndex, isTransitioning은 CarouselStateContext에서 제공됨
export type CarouselProps = {
  children: ReactNode[];
  itemsPerPage?: number;
  containerClassName?: string;
  itemClassName?: string;
  transitionDuration?: number; // ms 단위
  showControls?: boolean;
  onPrevClick?: () => void;
  onNextClick?: () => void;
};

// CarouselContainer (외부 래퍼) - 레이아웃만 담당
export type CarouselContainerProps = {
  children: ReactNode;
  containerClassName?: string;
};
