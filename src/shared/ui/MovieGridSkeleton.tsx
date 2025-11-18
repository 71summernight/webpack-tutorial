import React from 'react';

type MovieGridSkeletonProps = {
  count?: number;
  width?: number;
  height?: number;
};

export const MovieGridSkeleton = ({ count = 20, width = 290, height = 163 }: MovieGridSkeletonProps) => {
  return (
    <ul className="grid grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="relative w-full animate-pulse" style={{ width, height }}>
          <div className="w-full h-full bg-gray-700 rounded" />
        </li>
      ))}
    </ul>
  );
};
