import { LazyImage } from '@/shared/components/LazyImage';
import { Link } from 'react-router-dom';
import { PopularBadge } from './PopularBadge';

type MovieCardVariant = 'large' | 'medium' | 'small';

type VariantStyle = {
  width: number;
  height: number;
  className: string;
};

const VARIANT_STYLES: Record<MovieCardVariant, VariantStyle> = {
  large: {
    width: 300,
    height: 460,
    className: 'rounded-lg',
  },
  medium: {
    width: 290,
    height: 163,
    className: 'rounded-md',
  },
  small: {
    width: 48,
    height: 70,
    className: 'rounded',
  },
};

type MovieCardProps = {
  src: string;
  alt: string;
  to: string;
  variant?: MovieCardVariant;
  isPopular?: boolean;
  rank?: number;
};

type MovieCardComponent = React.FC<MovieCardProps>;
export const MovieCard: MovieCardComponent = ({ src, alt, to, variant = 'medium', isPopular = false, rank }) => {
  const { width, height, className } = VARIANT_STYLES[variant];

  return (
    <li className="relative">
      <Link to={to} className="relative block">
        {isPopular && typeof rank === 'number' && <PopularBadge rank={rank} />}
        <LazyImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={{ borderRadius: 'inherit' }}
        />
      </Link>
    </li>
  );
};
