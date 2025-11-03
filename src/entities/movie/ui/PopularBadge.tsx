interface PopularBadgeProps {
  index: number;
}

export function PopularBadge({ index }: PopularBadgeProps) {
  return (
    <span
      className="absolute text-white rounded-tl-md z-10 text-7xl font-bold italic"
      style={{
        bottom: '-15px',
        left: '-10px',
        opacity: 0.85,
      }}
    >
      {index + 1}
    </span>
  );
}
