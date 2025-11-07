import React, { ReactNode, useMemo, useRef } from 'react';

interface CarouselContainerProps {
  children: ReactNode;
  containerClassName?: string;
}

/**
 * CarouselContainer - 캐러셀 레이아웃 컨테이너
 * 메모이제이션으로 불필요한 리렌더링 방지
 */
export const CarouselContainer: React.FC<CarouselContainerProps> = ({ children, containerClassName }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // className 메모이제이션
  const containerClasses = useMemo(
    () => `relative overflow-hidden h-fit ${containerClassName || ''}`,
    [containerClassName],
  );

  return (
    <div className="space-y-6">
      {/* 캐러셀 메인 컨테이너 */}
      <div ref={containerRef} className={containerClasses}>
        {children}
      </div>
    </div>
  );
};
