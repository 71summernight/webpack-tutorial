import { PAGES } from '@/app/routes/paths';
import { Carousel, CarouselContainer } from '@/shared/components/Carousel';
import { CarouselStateProvider } from '@/shared/components/Carousel/CarouselStateContext';
import { DotPagination } from '@/shared/components/Pagination';
import { useCarouselState } from '@/shared/hooks/useCarouselState';
import { Movie } from '../types';
import { getPosterUrl } from '../utils';
import { MovieCard } from './MovieCard';

type MovieCarouselVariant = 'popular' | 'grid';

type VariantConfig = {
  itemsPerPage: number;
  cardVariant: 'large' | 'medium' | 'small';
  containerClassName: string;
  itemClassName: string;
  showPopularBadge: boolean;
};

const VARIANT_CONFIG: Record<MovieCarouselVariant, VariantConfig> = {
  popular: {
    itemsPerPage: 4,
    cardVariant: 'large',
    containerClassName: 'grid grid-cols-4 gap-4',
    itemClassName: 'w-full h-auto',
    showPopularBadge: true,
  },
  grid: {
    itemsPerPage: 4,
    cardVariant: 'medium',
    containerClassName: 'grid grid-cols-4 gap-4',
    itemClassName: 'w-full h-auto',
    showPopularBadge: false,
  },
};

const TRANSITION_DURATION = 300;

type MovieCarouselProps = {
  movies: Movie[];
  variant?: MovieCarouselVariant;
  showControls?: boolean;
  showPagination?: boolean;
};

type MovieCarouselComponent = React.FC<MovieCarouselProps>;
export const MovieCarousel: MovieCarouselComponent = ({
  movies,
  variant = 'popular',
  showControls = true,
  showPagination = true,
}) => {
  const config = VARIANT_CONFIG[variant];
  const { itemsPerPage, cardVariant, containerClassName, itemClassName, showPopularBadge } = config;

  const pageCount = Math.ceil(movies.length / itemsPerPage) || 1;

  const carouselState = useCarouselState({
    itemCount: pageCount,
    initialIndex: 0,
    loop: true,
    autoPlay: false,
    transitionDuration: TRANSITION_DURATION,
  });

  const { movePrev, moveNext } = carouselState;

  const movieCards = movies.map((movie, rank) => (
    <MovieCard
      key={movie.id}
      src={getPosterUrl(movie.poster_path)}
      alt={movie.title}
      to={PAGES.detail(movie.id)}
      variant={cardVariant}
      rank={rank}
      isPopular={showPopularBadge}
    />
  ));

  return (
    <CarouselStateProvider value={carouselState}>
      <CarouselContainer containerClassName="w-full">
        <Carousel
          containerClassName={containerClassName}
          itemClassName={itemClassName}
          showControls={showControls}
          onPrevClick={movePrev}
          onNextClick={moveNext}
        >
          {movieCards}
        </Carousel>
        {showPagination && <DotPagination pageCount={pageCount} />}
      </CarouselContainer>
    </CarouselStateProvider>
  );
};
