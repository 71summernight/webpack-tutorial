import { useEffect, useRef, useState, RefObject } from 'react';

const PLACEHOLDER_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';
const INTERSECTION_ROOT_MARGIN = '200px';

type UseLazyImageOptions = {
  src: string;
  rootMargin?: string;
};

type UseLazyImageReturn = {
  imgRef: RefObject<HTMLImageElement | null>;
  imageSrc: string;
  isLoaded: boolean;
  handleImageLoad: () => void;
};

type UseLazyImageHook = (options: UseLazyImageOptions) => UseLazyImageReturn;

export const useLazyImage: UseLazyImageHook = ({ src, rootMargin = INTERSECTION_ROOT_MARGIN }) => {
  const [imageSrc, setImageSrc] = useState<string>(PLACEHOLDER_SVG);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer로 lazy loading 처리
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, rootMargin]);

  // 브라우저 캐시된 이미지 감지
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalHeight !== 0) {
      setIsLoaded(true);
    }
  }, [imageSrc]);

  type HandleImageLoadFn = () => void;
  const handleImageLoad: HandleImageLoadFn = () => {
    setIsLoaded(true);
  };

  return {
    imgRef,
    imageSrc,
    isLoaded,
    handleImageLoad,
  };
};
