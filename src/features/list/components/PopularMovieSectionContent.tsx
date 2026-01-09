import { MovieCarousel } from '@/entities/movie/ui/MovieCarousel';
import { MovieType } from '../constants/movieTypes';
import { useMovieQuery } from '../hooks/useMovieQueries';

type PopularMovieSectionContentProps = {
  type: MovieType;
  showControls?: boolean;
};

export const PopularMovieSectionContent = ({ type, showControls = true }: PopularMovieSectionContentProps) => {
  const { data } = useMovieQuery(type);

  const movies = data?.results ?? [];
  if (!data?.results) return null;

  return <MovieCarousel movies={movies} variant="popular" showControls={showControls} />;
};
