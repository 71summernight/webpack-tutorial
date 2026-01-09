import { useEffect, useRef, useState } from 'react';

import { UseCarouselStateHook } from './useCarouselState.types';
import { useUnmount } from '../useLifecycle';

export const useCarouselState: UseCarouselStateHook = ({
  itemCount,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  transitionDuration = 300,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pageCount = itemCount;

  const getNextIndex = (prevIndex: number) =>
    loop ? (prevIndex + 1) % pageCount : Math.min(prevIndex + 1, pageCount - 1);

  const getPrevIndex = (prevIndex: number) =>
    loop ? (prevIndex - 1 + pageCount) % pageCount : Math.max(prevIndex - 1, 0);

  const moveNext = () => {
    setIsTransitioning(true);
    setCurrentIndex(getNextIndex);
  };

  const movePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex(getPrevIndex);
  };

  const moveTo = (index: number) => {
    if (index < 0 || index >= pageCount) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isTransitioning) return;

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

  useEffect(() => {
    if (!autoPlay) return;

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

  useUnmount(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
  });

  return {
    currentIndex,
    isTransitioning,
    moveNext,
    movePrev,
    moveTo,
    pageCount,
  };
};
