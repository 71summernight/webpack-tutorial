import { useCallback, useRef } from 'react';
import { FILTER_HEIGHT, HEADER_HEIGHT, OFFSET } from '../../../styles/constants';
import type { MovieType } from './useMovieQueries';

export function useScrollToSection() {
  const sectionRefs = useRef<{ [key in MovieType]: HTMLElement | null }>({
    popular: null,
    now_playing: null,
    top_rated: null,
    upcoming: null,
  });

  const setSectionRef = useCallback((type: MovieType, el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current[type] = el;
    }
  }, []);

  const scrollToSection = useCallback((selectedType: MovieType) => {
    const sectionRef = sectionRefs.current[selectedType];
    if (sectionRef) {
      const totalOffset = HEADER_HEIGHT + FILTER_HEIGHT + OFFSET;

      const targetPosition = sectionRef.getBoundingClientRect().top + window.scrollY - totalOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  }, []);

  return { sectionRefs, setSectionRef, scrollToSection };
}
