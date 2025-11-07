import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

interface UseCarouselStateOptions {
  itemCount: number;
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  transitionDuration?: number;
}

export const useCarouselState = ({
  itemCount,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  transitionDuration = 300,
}: UseCarouselStateOptions) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 페이지 수 (itemCount와 동일하지만 명시적으로)
  const pageCount = itemCount;

  // 다음/이전 인덱스 계산 로직 메모이제이션 (순수 함수)
  const getNextIndex = useCallback(
    (prevIndex: number) => (loop ? (prevIndex + 1) % pageCount : Math.min(prevIndex + 1, pageCount - 1)),
    [loop, pageCount],
  );

  const getPrevIndex = useCallback(
    (prevIndex: number) => (loop ? (prevIndex - 1 + pageCount) % pageCount : Math.max(prevIndex - 1, 0)),
    [loop, pageCount],
  );

  // 다음 인덱스로 이동
  const moveNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(getNextIndex);
  }, [getNextIndex]);

  // 이전 인덱스로 이동
  const movePrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex(getPrevIndex);
  }, [getPrevIndex]);

  // 특정 인덱스로 이동
  const moveTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= pageCount) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
    },
    [pageCount],
  );

  // 애니메이션 종료 후 isTransitioning 플래그 해제
  useEffect(() => {
    if (!isTransitioning) return;

    // 기존 타이머 정리
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [isTransitioning, transitionDuration]);

  // 자동 플레이
  useEffect(() => {
    if (!autoPlay) return;

    // 기존 인터벌 정리
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }

    autoPlayIntervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => {
        if (loop) {
          return (prev + 1) % pageCount;
        } else {
          return Math.min(prev + 1, pageCount - 1);
        }
      });
    }, autoPlayInterval);

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, loop, pageCount]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return {
    currentIndex,
    isTransitioning,
    moveNext,
    movePrev,
    moveTo,
    pageCount,
  };
};
