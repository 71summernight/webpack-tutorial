import React from 'react';
import { useCarouselContextState } from '../Carousel/CarouselStateContext';

type DotPaginationProps = {
  pageCount: number;
};

/**
 * 점(dot) 스타일의 페이지네이션 컴포넌트
 * CarouselStateContext에서 상태를 자동으로 구독
 */
export const DotPagination = ({ pageCount }: DotPaginationProps) => {
  const { currentIndex, isTransitioning, moveTo } = useCarouselContextState();
  const pageArray = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className="flex justify-center gap-1.5 mt-8">
      {pageArray.map((_, index) => (
        <button
          key={index}
          onClick={() => moveTo(index)}
          className={`transition-all duration-300 ${
            currentIndex === index
              ? 'w-8 h-1.5 bg-gray-800 rounded-full'
              : 'w-1.5 h-1.5 bg-gray-400 hover:bg-gray-600 rounded-full'
          }`}
          aria-label={`페이지 ${index + 1}`}
          aria-current={currentIndex === index ? 'true' : undefined}
          disabled={isTransitioning}
          type="button"
        />
      ))}
    </div>
  );
};
