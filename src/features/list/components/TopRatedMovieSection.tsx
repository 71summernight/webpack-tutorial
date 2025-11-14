import { Suspense } from 'react';
import { ErrorBoundary } from '../../../shared/components/ErrorBoundary';
import Loading from '../../../shared/ui/Loading';
import { MOVIE_TYPE_LABELS, MovieType } from '../constants/movieTypes';
import { GridMovieSectionContent } from './GridMovieSectionContent';

interface TopRatedMovieSectionProps {
  type: MovieType;
  setSectionRef: (type: MovieType, element: HTMLElement | null) => void;
}

export default function TopRatedMovieSection({ type, setSectionRef }: TopRatedMovieSectionProps) {
  return (
    <section ref={(el) => setSectionRef(type, el)} className="min-h-[450px]">
      <h2 className="font-bold text-white my-4 bg-primary px-4 py-2 my-5 rounded-lg w-fit">
        {MOVIE_TYPE_LABELS[type]}
      </h2>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <GridMovieSectionContent type={type} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
