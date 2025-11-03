import { useState } from 'react';
import { MOVIE_TYPES, MovieType } from '../constants/movieTypes';

export function useMovieTypeSelection() {
  const [selectedType, setSelectedType] = useState<MovieType>(MOVIE_TYPES[0]);
  const movieTypes = [...MOVIE_TYPES] as const;

  const handleTypeClick = (type: MovieType) => {
    setSelectedType(type);

    if (type === MOVIE_TYPES[0]) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(`movie-section-${type}`);
      if (element) {
        element.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
  };

  return { selectedType, handleTypeClick, MOVIE_TYPES: movieTypes };
}
