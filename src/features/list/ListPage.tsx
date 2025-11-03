import { useEffect, useState } from 'react';
import { HEADER_HEIGHT } from '../../styles/constants';
import { MovieTypeFilter } from './components/MovieTypeFilter';
import NowPlayingMovieSection from './components/NowPlayingMovieSection';
import PopularMovieSection from './components/PopularMovieSection';
import TopRatedMovieSection from './components/TopRatedMovieSection';
import UpcomingMovieSection from './components/UpcomingMovieSection';
import { type MovieType } from './hooks/useMovieQueries';
import { useScrollToSection } from './hooks/useScrollToSection';

const MOVIE_TYPES: MovieType[] = ['popular', 'now_playing', 'top_rated', 'upcoming'];

export default function ListPage() {
  const [selectedType, setSelectedType] = useState<MovieType>(MOVIE_TYPES[0]);
  const { scrollToSection } = useScrollToSection();

  const handleTypeClick = (type: MovieType) => {
    setSelectedType(type);
  };

  useEffect(() => {
    if (selectedType === MOVIE_TYPES[0]) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToSection(selectedType);
    }
  }, [selectedType]);

  return (
    <div className="px-10">
      <div className="sticky z-50 bg-black py-4 -mx-10 px-10 mb-4" style={{ top: HEADER_HEIGHT }}>
        <MovieTypeFilter types={MOVIE_TYPES} selectedType={selectedType} onTypeClick={handleTypeClick} />
      </div>
      <PopularMovieSection type={'popular'} />
      <NowPlayingMovieSection type={'now_playing'} />
      <TopRatedMovieSection type={'top_rated'} />
      <UpcomingMovieSection type={'upcoming'} />
    </div>
  );
}
