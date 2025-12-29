import { useMovieGenres } from '@/entities/movie/hooks/useMovieGenres';
import { MovieDetail, MovieReviewListResponse } from '@/entities/movie/types';
import { getGenreName, getPosterUrl } from '@/entities/movie/utils';
import { LazyImage } from '@/shared/components/LazyImage';
import { StarRating } from '@/shared/components/StarRating/StarRating';
import clsx from 'clsx';
import ReviewList from './ReviewList';

interface DetailMainProps {
  movie: MovieDetail;
  reviews: MovieReviewListResponse;
}

const DetailMain = ({ movie, reviews }: DetailMainProps) => {
  const { data: movieGenres } = useMovieGenres();

  return (
    <section className="relative bg-[#1D1F1D] bg-gradient-radial-center p-10">
      <div className="flex items-center justify-between gap-4">
        <div className="w-fit">
          <h1 className="text-4xl font-bold italic">{movie.title}</h1>
          <div className="flex items-center gap-2">
            <span className={clsx('text-sm font-bold', movie.adult ? 'text-red-500' : 'text-green-500')}>
              {movie.adult ? '18+' : '15+'}
            </span>
            <span>{movie.release_date.split('-')[0]}</span>
            <span>{movie.runtime}분</span>
            <span>{movie.genres.map((genre) => getGenreName(movieGenres?.genres || [], genre.id)).join(', ')}</span>
          </div>
          <div className="mt-4">{movie.overview}</div>
        </div>
        {movie.poster_path && (
          <LazyImage src={getPosterUrl(movie.poster_path)} alt={movie.title} width={567} height={312} />
        )}
      </div>
      <StarRating rating={movie.vote_average} size={80} showScore />
      <ReviewList reviews={reviews.results} />
    </section>
  );
};

export default DetailMain;
