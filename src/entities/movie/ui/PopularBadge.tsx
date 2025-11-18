type PopularBadgeProps = {
  index: number;
};

export const PopularBadge = ({ index }: PopularBadgeProps) => {
  return (
    <span
      className="absolute text-white rounded-tl-md z-10 text-7xl font-bold italic"
      style={{
        bottom: '-1px',
        left: '-1px',
        opacity: 0.85,
      }}
    >
      {index + 1}
    </span>
  );
};
