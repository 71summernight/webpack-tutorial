import { useMovieGenres } from '@/entities/movie/hooks/useMovieGenres';
import { getGenreName, getPosterUrl } from '@/entities/movie/utils';
import { LazyImage } from '@/shared/components/LazyImage';
import { StarRating } from '@/shared/components/StarRating/StarRating';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { useMovieDetail } from '../hooks/useMovieDetail';
import { useMovieReviews } from '../hooks/useMovieReviews';
import ReviewList from './ReviewList';

const DetailMain = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? Number(id) : undefined;

  const { data: movie } = useMovieDetail(movieId);
  const { data: reviews } = useMovieReviews(movieId);
  const { data: movieGenres } = useMovieGenres();

  const { results } = reviews;
  const { title, adult, release_date, runtime, genres, vote_average, poster_path, overview } = movie;
  return (
    <section className="relative bg-[#1D1F1D] bg-gradient-radial-center p-10">
      <div className="flex items-center justify-between gap-4">
        <div className="w-fit">
          <h1 className="text-4xl font-bold italic">{title}</h1>
          <div className="flex items-center gap-2">
            <span className={clsx('text-sm font-bold', adult ? 'text-red-500' : 'text-green-500')}>
              {adult ? '18+' : '15+'}
            </span>
            <span>{release_date.split('-')[0]}</span>
            <span>{runtime}분</span>
            <span>{genres.map((genre) => getGenreName(movieGenres.genres, genre.id)).join(', ')}</span>
          </div>
          <div className="mt-4">{overview}</div>
        </div>
        {poster_path && <LazyImage src={getPosterUrl(poster_path)} alt={title} width={567} height={312} />}
      </div>
      <StarRating rating={vote_average} size={80} showScore />
      <ReviewList reviews={results} />
    </section>
  );
};

export default DetailMain;
