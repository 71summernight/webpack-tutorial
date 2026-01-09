import React, { ReactNode, useRef } from 'react';

type CarouselContainerProps = {
  children: ReactNode;
  containerClassName?: string;
};

/**
 * CarouselContainer - 캐러셀 레이아웃 컨테이너
 */
export const CarouselContainer = ({ children, containerClassName }: CarouselContainerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const containerClasses = `relative overflow-hidden h-fit ${containerClassName || ''}`;

  return (
    <div className="space-y-6">
      {/* 캐러셀 메인 컨테이너 */}
      <div ref={containerRef} className={containerClasses}>
        {children}
      </div>
    </div>
  );
};
