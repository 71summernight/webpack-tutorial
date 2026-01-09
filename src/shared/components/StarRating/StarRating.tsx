import { GetStarFillPercentageFn, StarProps, StarRatingProps } from './StarRating.types';

const STAR_PATH = 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z';
const FILLED_COLOR = '#fbbf24';
const EMPTY_COLOR = '#d1d5db';

const getStarFillPercentage: GetStarFillPercentageFn = (normalizedRating, starIndex) => {
  const starPosition = starIndex + 1;

  if (normalizedRating >= starPosition) return 100;
  if (normalizedRating > starIndex) return (normalizedRating - starIndex) * 100;
  return 0;
};

const Star = ({ fillPercentage, index, size }: StarProps) => (
  <div className="inline-flex items-center justify-center" style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id={`star-gradient-${index}`}>
          <stop offset={`${fillPercentage}%`} stopColor={FILLED_COLOR} />
          <stop offset={`${fillPercentage}%`} stopColor={EMPTY_COLOR} />
        </linearGradient>
      </defs>
      <path d={STAR_PATH} fill={`url(#star-gradient-${index})`} strokeOpacity="0" />
    </svg>
  </div>
);

export const StarRating = ({ rating, maxStars = 5, size = 24, showScore = false, className = '' }: StarRatingProps) => {
  const normalizedRating = (rating / 10) * maxStars;

  const stars = Array.from({ length: maxStars }, (_, index) => ({
    id: index,
    fillPercentage: getStarFillPercentage(normalizedRating, index),
  }));

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="inline-flex gap-0.5">
        {stars.map(({ id, fillPercentage }) => (
          <Star key={id} fillPercentage={fillPercentage} index={id} size={size} />
        ))}
      </div>
      {showScore && (
        <span className="font-medium text-gray-700 whitespace-nowrap mt-2" style={{ fontSize: size * 0.2 }}>
          {(rating / 2).toFixed(1)} / 5
        </span>
      )}
    </div>
  );
};
