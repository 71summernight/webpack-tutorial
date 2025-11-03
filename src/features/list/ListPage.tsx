import { HEADER_HEIGHT } from '../../styles/constants';
import { MovieTypeFilter } from './components/MovieTypeFilter';
import NowPlayingMovieSection from './components/NowPlayingMovieSection';
import PopularMovieSection from './components/PopularMovieSection';
import TopRatedMovieSection from './components/TopRatedMovieSection';
import UpcomingMovieSection from './components/UpcomingMovieSection';
import { useMovieTypeSelection } from './hooks/useMovieTypeSelection';

export default function ListPage() {
  const { selectedType, handleTypeClick, MOVIE_TYPES } = useMovieTypeSelection();

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
