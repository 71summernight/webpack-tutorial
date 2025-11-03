import { useRef, useState } from 'react';
import { MOVIE_TYPES, MovieType } from '../constants/movieTypes';

export function useMovieTypeSelection() {
  const [selectedType, setSelectedType] = useState<MovieType>(MOVIE_TYPES[0]);
  const sectionRefs = useRef<Map<MovieType, HTMLElement>>(new Map());

  const handleTypeClick = (type: MovieType) => {
    setSelectedType(type);

    requestAnimationFrame(() => {
      if (type === MOVIE_TYPES[0]) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = sectionRefs.current.get(type);
        if (element) {
          element.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      }
    });
  };

  const setSectionRef = (type: MovieType, element: HTMLElement | null) => {
    if (element) {
      sectionRefs.current.set(type, element);
    } else {
      sectionRefs.current.delete(type);
    }
  };

  return { selectedType, handleTypeClick, MOVIE_TYPES: [...MOVIE_TYPES], setSectionRef };
}
