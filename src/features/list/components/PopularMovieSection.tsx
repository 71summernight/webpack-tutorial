import { Suspense } from 'react';
import { ErrorBoundary } from '../../../shared/components/ErrorBoundary';
import Loading from '../../../shared/ui/Loading';
import { MOVIE_TYPE_LABELS, MovieType } from '../constants/movieTypes';
import { PopularMovieSectionContent } from './PopularMovieSectionContent';

export default function PopularMovieSection({ type }: { type: MovieType }) {
  return (
    <section id={`movie-section-${type}`}>
      <h2 className="font-bold text-white my-4 bg-primary px-4 py-2 my-5 rounded-lg w-fit">
        {MOVIE_TYPE_LABELS[type]}
      </h2>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <PopularMovieSectionContent type={type} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
