import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { MovieGridSkeleton } from '@/shared/ui/MovieGridSkeleton';
import { Suspense } from 'react';
import { MOVIE_TYPE_LABELS, MovieType } from '../constants/movieTypes';
import { PopularMovieSectionContent } from './PopularMovieSectionContent';

type PopularMovieSectionProps = {
  type: MovieType;
  setSectionRef: (type: MovieType, element: HTMLElement | null) => void;
};

const PopularMovieSection = ({ type, setSectionRef }: PopularMovieSectionProps) => {
  return (
    <section ref={(el) => setSectionRef(type, el)}>
      <h2 className="font-bold text-white my-4 bg-primary px-4 py-2 my-5 rounded-lg w-fit whitespace-nowrap">
        {MOVIE_TYPE_LABELS[type]}
      </h2>
      <ErrorBoundary>
        <Suspense fallback={<MovieGridSkeleton width={300} height={460} count={4} />}>
          <PopularMovieSectionContent type={type} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
};

export default PopularMovieSection;
