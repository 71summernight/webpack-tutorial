import React from 'react';

type CarouselSkeletonProps = {
  itemsPerPage?: number;
};

export const CarouselSkeleton = ({ itemsPerPage = 4 }: CarouselSkeletonProps) => {
  return (
    <div className="space-y-6">
      {/* CarouselContainer와 동일한 구조 */}
      <div className="relative overflow-hidden h-fit w-full">
        {/* Carousel과 동일한 grid 구조 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${itemsPerPage}, 1fr)`,
            gap: '1rem',
          }}
          className="relative overflow-hidden w-full"
        >
          {/* MovieCard와 동일한 skeleton */}
          {Array.from({ length: itemsPerPage }, (_, index) => (
            <div key={index} className="w-full h-auto">
              <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                <div className="w-full h-full bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DotPagination Skeleton - 실제 pagination 스타일과 동일 */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="w-2 h-2 rounded-full bg-gray-700 opacity-50" />
        ))}
      </div>
    </div>
  );
};
