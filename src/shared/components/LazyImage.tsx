import { useEffect, useRef, useState } from 'react';

import type { CSSProperties } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  onClick,
  style = {},
  fetchPriority = 'high',
}: LazyImageProps) {
  // CLS 방지: 빈 SVG placeholder로 시작
  const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
      },
    );

    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  // 브라우저가 캐시한 이미지 감지
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalHeight !== 0) {
      // 이미 로드된 이미지 (브라우저 캐시)
      setIsLoaded(true);
    }
  }, [imageSrc]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      style={{
        aspectRatio: `${width} / ${height}`,
        overflow: 'hidden',
        backgroundColor: '#e5e7eb',
        position: 'relative',
        borderRadius: style?.borderRadius,
      }}
    >
      <img
        ref={imgRef}
        src={imageSrc || undefined}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
        loading="lazy"
        decoding="async"
        fetchPriority={fetchPriority}
        role={onClick ? 'button' : undefined}
        onLoad={handleImageLoad}
        onClick={onClick}
        style={{
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoaded ? 1 : 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          cursor: onClick ? 'pointer' : 'inherit',
          display: 'block',
          ...style,
        }}
      />
    </div>
  );
}
