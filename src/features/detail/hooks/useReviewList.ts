import { useMemo } from 'react';
import { MovieReview } from '@/entities/movie/types';

export const useReviewList = (reviews: MovieReview[]) => {
  const sortedReviews = useMemo(
    () => [...reviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [reviews],
  );

  const isEmpty = reviews.length === 0;
  const totalCount = reviews.length;

  return {
    sortedReviews,
    isEmpty,
    totalCount,
  };
};
