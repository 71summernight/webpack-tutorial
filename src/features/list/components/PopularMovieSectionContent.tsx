import { useMemo } from 'react';
import { PAGES } from '../../../app/routes/paths';
import { MovieCard } from '../../../entities/movie/ui/MovieCard';
import { getPosterUrl } from '../../../entities/movie/utils';
import { Carousel, CarouselContainer } from '../../../shared/components/Carousel';
import { CarouselStateProvider } from '../../../shared/components/Carousel/CarouselStateContext';
import { DotPagination } from '../../../shared/components/Pagination';
import { useCarouselState as useCarouselStateHook } from '../../../shared/hooks/useCarouselState';
import { MovieType } from '../constants/movieTypes';
import { useMovieQuery } from '../hooks/useMovieQueries';

const ITEMS_PER_PAGE = 4;
const CONTAINER_CLASS_NAME = 'w-full';
const ITEM_CLASS_NAME = 'w-full h-auto';
const TRANSITION_DURATION = 300;
const CONTAINER_GRID_CLASS = `grid grid-cols-${ITEMS_PER_PAGE} gap-4`;

interface PopularMovieSectionContentProps {
  type: MovieType;
  showControls?: boolean;
}

export function PopularMovieSectionContent({ type, showControls = true }: PopularMovieSectionContentProps) {
  const { data } = useMovieQuery(type);

  if (!data?.results) return null;

  const movies = data.results;

  const movieCards = useMemo(
    () =>
      movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          width={290}
          height={163}
          to={`${PAGES.detail(movie.id)}`}
          index={index}
          isPopular={true}
        />
      )),
    [movies],
  );

  const pageCount = Math.ceil(movies.length / ITEMS_PER_PAGE);

  // 캐러셀 상태 관리
  const carouselState = useCarouselStateHook({
    itemCount: pageCount,
    initialIndex: 0,
    loop: true,
    autoPlay: false,
    autoPlayInterval: 1000,
    transitionDuration: TRANSITION_DURATION,
  });

  return (
    <CarouselStateProvider value={carouselState}>
      <CarouselContainer containerClassName={CONTAINER_CLASS_NAME}>
        <Carousel
          containerClassName={CONTAINER_GRID_CLASS}
          itemClassName={ITEM_CLASS_NAME}
          showControls={showControls}
          onPrevClick={carouselState.movePrev}
          onNextClick={carouselState.moveNext}
        >
          {movieCards}
        </Carousel>
        <DotPagination pageCount={pageCount} />
      </CarouselContainer>
    </CarouselStateProvider>
  );
}
