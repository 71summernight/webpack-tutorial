import { useRef, useState } from 'react';
import { MOVIE_TYPES, MovieType } from '../constants/movieTypes';

type UseMovieTypeSelectionReturn = {
  selectedType: MovieType;
  handleTypeClick: (type: MovieType) => void;
  setSectionRef: (type: MovieType, element: HTMLElement | null) => void;
};

type UseMovieTypeSelectionHook = () => UseMovieTypeSelectionReturn;

export const useMovieTypeSelection: UseMovieTypeSelectionHook = () => {
  const [selectedType, setSelectedType] = useState<MovieType>(MOVIE_TYPES[0]);
  const sectionRefs = useRef<Map<MovieType, HTMLElement>>(new Map());

  type HandleTypeClickFn = (type: MovieType) => void;
  const handleTypeClick: HandleTypeClickFn = (type) => {
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

  type SetSectionRefFn = (type: MovieType, element: HTMLElement | null) => void;
  const setSectionRef: SetSectionRefFn = (type, element) => {
    if (element) {
      sectionRefs.current.set(type, element);
    } else {
      sectionRefs.current.delete(type);
    }
  };

  return { selectedType, handleTypeClick, MOVIE_TYPES, setSectionRef };
};
