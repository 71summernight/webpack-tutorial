import { lazy } from 'react';
import { HEADER_HEIGHT } from '../../styles/constants';
import { MovieTypeFilter } from './components/MovieTypeFilter';

import { useMovieTypeSelection } from './hooks/useMovieTypeSelection';

const NowPlayingMovieSection = lazy(() => import('./components/NowPlayingMovieSection'));
const TopRatedMovieSection = lazy(() => import('./components/TopRatedMovieSection'));
const UpcomingMovieSection = lazy(() => import('./components/UpcomingMovieSection'));
const PopularMovieSection = lazy(() => import('./components/PopularMovieSection'));

export default function ListPage() {
  const { selectedType, handleTypeClick, MOVIE_TYPES, setSectionRef } = useMovieTypeSelection();

  return (
    <div className="px-10">
      <div className="sticky z-50 bg-black py-4 -mx-10 px-10 mb-4" style={{ top: HEADER_HEIGHT }}>
        <MovieTypeFilter types={MOVIE_TYPES} selectedType={selectedType} onTypeClick={handleTypeClick} />
      </div>
      <PopularMovieSection type={'popular'} setSectionRef={setSectionRef} />
      <NowPlayingMovieSection type={'now_playing'} setSectionRef={setSectionRef} />
      <TopRatedMovieSection type={'top_rated'} setSectionRef={setSectionRef} />
      <UpcomingMovieSection type={'upcoming'} setSectionRef={setSectionRef} />
    </div>
  );
}
