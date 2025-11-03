import { MOVIE_TYPE_LABELS, MovieType } from '../constants/movieTypes';

interface MovieTypeFilterProps {
  types: readonly MovieType[];
  selectedType: MovieType;
  onTypeClick: (type: MovieType) => void;
}

export function MovieTypeFilter({ types, selectedType, onTypeClick }: MovieTypeFilterProps) {
  return (
    <ul className="flex gap-2">
      {types.map((type) => (
        <li key={type}>
          <button
            className={`rounded-2xl py-2 px-4 transition-colors focus:ring-2 focus:ring-white focus:outline-none
    ${selectedType === type ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800 border border-gray-700'}`}
            onClick={() => onTypeClick(type)}
            aria-pressed={selectedType === type}
          >
            <span>{MOVIE_TYPE_LABELS[type]}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
