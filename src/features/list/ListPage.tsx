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
      {/* CLS 방지: 각 섹션에 최소 높이 지정 */}
      <div style={{ minHeight: '200px' }}>
        <PopularMovieSection type={'popular'} setSectionRef={setSectionRef} />
      </div>
      <div style={{ minHeight: '450px' }}>
        <NowPlayingMovieSection type={'now_playing'} setSectionRef={setSectionRef} />
      </div>
      <div style={{ minHeight: '450px' }}>
        <TopRatedMovieSection type={'top_rated'} setSectionRef={setSectionRef} />
      </div>
      <div style={{ minHeight: '450px' }}>
        <UpcomingMovieSection type={'upcoming'} setSectionRef={setSectionRef} />
      </div>
    </div>
  );
}
