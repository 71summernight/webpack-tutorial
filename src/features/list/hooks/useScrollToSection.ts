import { useRef } from 'react';
import type { MovieType } from './useMovieQueries';

export function useScrollToSection() {
  const sectionRefs = useRef<{ [key in MovieType]: HTMLElement | null }>({
    popular: null,
    now_playing: null,
    top_rated: null,
    upcoming: null,
  });

  const setSectionRef = (type: MovieType, el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current[type] = el;
    }
  };

  const scrollToSection = (selectedType: MovieType) => {
    const sectionRef = sectionRefs.current[selectedType];
    if (sectionRef) {
      // Header(64px) + Filter(56px) + offset(20px) = 140px
      const HEADER_HEIGHT = 64;
      const FILTER_HEIGHT = 56;
      const OFFSET = 20;
      const totalOffset = HEADER_HEIGHT + FILTER_HEIGHT + OFFSET;

      const targetPosition = sectionRef.getBoundingClientRect().top + window.scrollY - totalOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  return { sectionRefs, setSectionRef, scrollToSection };
}
