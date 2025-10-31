import { MOVIE_TYPE_LABELS } from '../constants/movieTypeLabels';
import type { MovieType } from '../hooks/useMovieQueries';

interface MovieTypeFilterProps {
  types: MovieType[];
  selectedType: MovieType;
  onTypeClick: (type: MovieType) => void;
}

export function MovieTypeFilter({ types, selectedType, onTypeClick }: MovieTypeFilterProps) {
  return (
    <ul className="flex gap-2">
      {types.map((type) => (
        <li key={type}>
          <button
            className={`rounded-2xl py-2 px-4 ${selectedType === type ? 'bg-white text-black' : 'bg-black text-white'}`}
            onClick={() => onTypeClick(type)}
          >
            <span>{MOVIE_TYPE_LABELS[type]}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
