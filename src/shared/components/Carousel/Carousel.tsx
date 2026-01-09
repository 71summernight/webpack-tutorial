import React, { ReactNode } from 'react';
import { useCarouselContextState } from './CarouselStateContext';

type CarouselProps = {
  children: ReactNode[];
  itemsPerPage?: number;
  containerClassName?: string;
  itemClassName?: string;
  transitionDuration?: number;
  showControls?: boolean;
  onPrevClick?: () => void;
  onNextClick?: () => void;
};

// 버튼 스타일 상수화 (렌더링 외부)
const PREV_BUTTON_CLASS =
  'absolute left-3 top-1/2 -translate-y-1/2 text-white hover:text-white/80 transition z-10 bg-white/10 hover:bg-white/20 rounded-lg p-2 backdrop-blur-sm';
const NEXT_BUTTON_CLASS =
  'absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white/80 transition z-10 bg-white/10 hover:bg-white/20 rounded-lg p-2 backdrop-blur-sm';

export const Carousel: React.FC<CarouselProps> = ({
  children,
  itemsPerPage = 4,
  containerClassName = 'grid grid-cols-4 gap-4',
  itemClassName,
  transitionDuration = 300,
  showControls = true,
  onPrevClick,
  onNextClick,
}) => {
  const { currentIndex, isTransitioning } = useCarouselContextState();

  // children을 배열로 정규화 (React.Children.toArray로 안정적인 key 보장)
  const childrenArray = React.Children.toArray(children);

  // 현재 페이지의 시작 인덱스와 보이는 아이템 계산
  const startIndex = currentIndex * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, childrenArray.length);
  const visibleItems = childrenArray.slice(startIndex, endIndex);

  const gridContainerClassName = `relative overflow-hidden w-full ${containerClassName}`;

  const itemStyle = {
    width: '100%',
    transition: isTransitioning ? `opacity ${transitionDuration}ms ease-in-out` : 'none',
  };

  const containerStyle = {
    opacity: isTransitioning ? 0.95 : 1,
    transition: isTransitioning ? `opacity ${transitionDuration}ms ease-in-out` : 'none',
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`,
        gap: 'inherit',
        ...containerStyle,
      }}
      className={gridContainerClassName}
    >
      {visibleItems.map((child) => (
        <div key={(child as React.ReactElement).key} style={itemStyle} className={itemClassName || ''}>
          {child}
        </div>
      ))}

      {/* 양옆 화살표 버튼 */}
      {showControls && (
        <>
          <button
            onClick={onPrevClick}
            className={PREV_BUTTON_CLASS}
            aria-label="이전"
            disabled={isTransitioning}
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onNextClick}
            className={NEXT_BUTTON_CLASS}
            aria-label="다음"
            disabled={isTransitioning}
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};
