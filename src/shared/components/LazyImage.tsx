import React, { type CSSProperties } from 'react';
import { useLazyImage } from '../hooks/useLazyImage';

type LazyImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  fetchPriority?: 'high' | 'low' | 'auto';
};

export const LazyImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  onClick,
  style = {},
  fetchPriority = 'high',
}: LazyImageProps) => {
  const { imgRef, imageSrc, isLoaded, handleImageLoad } = useLazyImage({ src });

  // width와 height가 숫자일 때만 aspectRatio 계산
  const shouldUseAspectRatio = typeof width === 'number' && typeof height === 'number';
  const aspectRatio = shouldUseAspectRatio ? `${width} / ${height}` : undefined;

  return (
    <div
      className="relative overflow-hidden bg-gray-200 w-full h-full"
      style={{
        aspectRatio,
        borderRadius: style?.borderRadius,
        ...(typeof width === 'number' && { width }),
        ...(typeof height === 'number' && { height }),
      }}
    >
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`block w-full h-full object-cover transition-opacity duration-300 ease-in-out ${className} ${isLoaded ? 'loaded' : 'loading'}`}
        loading="lazy"
        decoding="async"
        fetchPriority={fetchPriority}
        role={onClick ? 'button' : undefined}
        onLoad={handleImageLoad}
        onClick={onClick}
        style={{
          opacity: isLoaded ? 1 : 0,
          cursor: onClick ? 'pointer' : 'inherit',
          ...style,
        }}
      />
    </div>
  );
};
