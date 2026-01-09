import { useState } from 'react';
import { MovieReview } from '@/entities/movie/types';

const TMDB_AVATAR_BASE_URL = 'https://image.tmdb.org/t/p/w45';
const MAX_CONTENT_LENGTH = 300;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getAvatarUrl = (avatarPath: string | null): string | null => {
  if (!avatarPath) return null;
  if (avatarPath.startsWith('/https://')) {
    return avatarPath.slice(1);
  }
  return `${TMDB_AVATAR_BASE_URL}${avatarPath}`;
};

const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

export const useReviewCard = (review: MovieReview) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { author, author_details, content, created_at } = review;

  const avatarUrl = getAvatarUrl(author_details.avatar_path);
  const initial = getInitial(author);
  const formattedDate = formatDate(created_at);

  const isLongContent = content.length > MAX_CONTENT_LENGTH;
  const displayContent = isExpanded || !isLongContent ? content : `${content.slice(0, MAX_CONTENT_LENGTH)}...`;

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  return {
    author,
    authorDetails: author_details,
    avatarUrl,
    initial,
    formattedDate,
    displayContent,
    isLongContent,
    isExpanded,
    toggleExpanded,
  };
};
