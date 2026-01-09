import { useEffect, useRef } from 'react';

type EffectCallback = () => void;

export const useMount = (callback: EffectCallback): void => {
  useEffect(() => {
    callback();
  }, []);
};

export const useUnmount = (callback: EffectCallback): void => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
};
