import React, { createContext, useContext, ReactNode, useMemo } from 'react';

export type CarouselContextValue = {
  currentIndex: number;
  isTransitioning: boolean;
  moveNext: () => void;
  movePrev: () => void;
  moveTo: (index: number) => void;
};

const CarouselStateContext = createContext<CarouselContextValue | undefined>(undefined);

type CarouselStateProviderProps = {
  children: ReactNode;
  value: CarouselContextValue;
};

/**
 * CarouselStateProvider - Context 제공자
 * 메모이제이션으로 성능 최적화
 */
export const CarouselStateProvider: React.FC<CarouselStateProviderProps> = ({ children, value }) => {
  // value를 메모이제이션하여 참조 동일성 보장
  const memoizedValue = useMemo(
    () => value,
    [value.currentIndex, value.isTransitioning, value.moveNext, value.movePrev, value.moveTo],
  );

  return <CarouselStateContext.Provider value={memoizedValue}>{children}</CarouselStateContext.Provider>;
};

/**
 * 캐러셀 상태를 받는 훅
 * CarouselContainer 내부에서만 사용 가능
 */
type UseCarouselContextStateHook = () => CarouselContextValue;
export const useCarouselContextState: UseCarouselContextStateHook = () => {
  const context = useContext(CarouselStateContext);
  if (!context) {
    throw new Error('useCarouselContextState must be used within CarouselStateProvider');
  }
  return context;
};
