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
  fetchPriority = 'auto',
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect(); // 이미지 로드 후 observer 완전 해제
        }
      },
      {
        rootMargin: '50px', // 요소가 화면에 50px 들어오면 로드 시작
      },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect(); // cleanup에서 안전하게 해제
    };
  }, [src]);

  return (
    <div
      style={{
        aspectRatio: `${width} / ${height}`,
        overflow: 'hidden',
        backgroundColor: '#e5e7eb',
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
        onLoad={() => setIsLoaded(true)}
        onClick={onClick}
        style={{
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoaded ? 1 : 0.5,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          cursor: onClick ? 'pointer' : 'default',
          ...style,
        }}
      />
    </div>
  );
}
