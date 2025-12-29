import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { MovieGridSkeleton } from '@/shared/ui/MovieGridSkeleton';
import { MOVIE_TYPE_LABELS, MovieType } from '../constants/movieTypes';
import { GridMovieSectionContent } from './GridMovieSectionContent';

type UpcomingMovieSectionProps = {
  type: MovieType;
  setSectionRef: (type: MovieType, element: HTMLElement | null) => void;
};

const UpcomingMovieSection = ({ type, setSectionRef }: UpcomingMovieSectionProps) => {
  return (
    <section ref={(el) => setSectionRef(type, el)}>
      <h2 className="font-bold text-white my-4 bg-primary px-4 py-2 my-5 rounded-lg w-fit whitespace-nowrap">
        {MOVIE_TYPE_LABELS[type]}
      </h2>
      <ErrorBoundary>
        <Suspense fallback={<MovieGridSkeleton width={290} height={163} />}>
          <GridMovieSectionContent type={type} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
};

export default UpcomingMovieSection;
