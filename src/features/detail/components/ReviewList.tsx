import { MovieReview } from '@/entities/movie/types';
import { StarRating } from '@/shared/components/StarRating/StarRating';
import { useReviewCard } from '../hooks/useReviewCard';
import { useReviewList } from '../hooks/useReviewList';

interface ReviewCardProps {
  review: MovieReview;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const {
    author,
    authorDetails,
    avatarUrl,
    initial,
    formattedDate,
    displayContent,
    isLongContent,
    isExpanded,
    toggleExpanded,
  } = useReviewCard(review);

  return (
    <article className="rounded-xl bg-gray-800/50 p-5 backdrop-blur-sm transition-colors hover:bg-gray-800/70">
      <header className="mb-4 flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
          {avatarUrl ? (
            <img src={avatarUrl} alt={author} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">{initial}</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-white">{authorDetails.name || author}</h3>
            {authorDetails.name && authorDetails.username && (
              <span className="truncate text-sm text-gray-400">@{authorDetails.username}</span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            {authorDetails.rating !== null && (
              <div className="flex items-center gap-1">
                <StarRating rating={authorDetails.rating} maxStars={5} size={16} />
                <span className="text-sm font-medium text-yellow-400">{authorDetails.rating}/10</span>
              </div>
            )}
            <time className="text-sm text-gray-400">{formattedDate}</time>
          </div>
        </div>
      </header>

      <div className="text-gray-300">
        <p className="whitespace-pre-line leading-relaxed">{displayContent}</p>
        {isLongContent && (
          <button
            onClick={toggleExpanded}
            className="mt-2 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            {isExpanded ? '접기' : '더 보기'}
          </button>
        )}
      </div>
    </article>
  );
};

interface ReviewListProps {
  reviews: MovieReview[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  const { sortedReviews, isEmpty, totalCount } = useReviewList(reviews);

  if (isEmpty) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-400">아직 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-white">
        리뷰 <span className="text-gray-400">({totalCount})</span>
      </h2>
      <div className="flex flex-col gap-4">
        {sortedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
};

export default ReviewList;
