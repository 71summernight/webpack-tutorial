import { useCallback } from 'react';
import { MovieType } from './useMovieQueries';

export function useScrollToSection() {
  const scrollToSection = useCallback((selectedType: MovieType) => {
    const element = document.getElementById(`movie-section-${selectedType}`);
    if (element) {
      element.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, []);

  return { scrollToSection };
}
