export type StarRatingProps = {
  rating: number; // 0 ~ 10 점수
  maxStars?: number; // 최대 별 개수 (기본값: 5)
  size?: number; // 별 크기 (기본값: 24)
  showScore?: boolean; // 점수 텍스트 표시 여부 (기본값: false)
  className?: string;
};

export type StarProps = {
  fillPercentage: number;
  index: number;
  size: number;
};

export type GetStarFillPercentageFn = (normalizedRating: number, starIndex: number) => number;
