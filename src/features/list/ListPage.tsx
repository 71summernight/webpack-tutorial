import { useEffect, useState } from 'react';
import { HEADER_HEIGHT } from '../../styles/constants';
import { MovieSection } from './components/MovieSection';
import { MovieTypeFilter } from './components/MovieTypeFilter';
import { useMovieQueries, type MovieType } from './hooks/useMovieQueries';
import { useScrollToSection } from './hooks/useScrollToSection';

const MOVIE_TYPES: MovieType[] = ['popular', 'now_playing', 'top_rated', 'upcoming'];

export default function ListPage() {
  const results = useMovieQueries(MOVIE_TYPES);
  const [selectedType, setSelectedType] = useState<MovieType>(MOVIE_TYPES[0]);
  const { setSectionRef, scrollToSection } = useScrollToSection();

  const handleTypeClick = (type: MovieType) => {
    setSelectedType(type);
  };

  useEffect(() => {
    if (selectedType === MOVIE_TYPES[0]) {
      // 첫 번째 타입이면 맨 위로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToSection(selectedType);
    }
  }, [selectedType]);

  return (
    <div className="p-10 ">
      <div className="sticky z-50 bg-black py-4 -mx-10 px-10 mb-4" style={{ top: HEADER_HEIGHT }}>
        <MovieTypeFilter types={MOVIE_TYPES} selectedType={selectedType} onTypeClick={handleTypeClick} />
      </div>
      {results.map((result, index) => (
        <div key={MOVIE_TYPES[index]} ref={(el) => setSectionRef(MOVIE_TYPES[index], el)}>
          <MovieSection
            type={MOVIE_TYPES[index]}
            data={result.data}
            isLoading={result.isLoading}
            error={result.error as Error | null}
            refetch={result.refetch}
          />
        </div>
      ))}
    </div>
  );
}
