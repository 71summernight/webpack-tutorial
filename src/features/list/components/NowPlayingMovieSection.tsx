import { Suspense } from 'react';
import { ErrorBoundary } from '../../../shared/components/ErrorBoundary';
import Loading from '../../../shared/ui/Loading';
import { MOVIE_TYPE_LABELS, MovieType } from '../constants/movieTypes';
import { NowPlayingMovieSectionContent } from './NowPlayingMovieSectionContent';

interface NowPlayingMovieSectionProps {
  type: MovieType;
  setSectionRef: (type: MovieType, element: HTMLElement | null) => void;
}

export default function NowPlayingMovieSection({ type, setSectionRef }: NowPlayingMovieSectionProps) {
  return (
    <section ref={(el) => setSectionRef(type, el)}>
      <h2 className="font-bold text-white my-4 bg-primary px-4 py-2 my-5 rounded-lg w-fit">
        {MOVIE_TYPE_LABELS[type]}
      </h2>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <NowPlayingMovieSectionContent type={type} />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
