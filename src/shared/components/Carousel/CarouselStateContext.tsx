import React, { createContext, ReactNode, useContext } from 'react';

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
 * 메모이제이션은 useCarouselState 훅에서 처리
 */
export const CarouselStateProvider: React.FC<CarouselStateProviderProps> = ({ children, value }) => {
  return <CarouselStateContext.Provider value={value}>{children}</CarouselStateContext.Provider>;
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
