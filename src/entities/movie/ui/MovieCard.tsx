import { Link } from 'react-router-dom';
import { LazyImage } from '@/shared/components/LazyImage';
import { PopularBadge } from './PopularBadge';

type MovieCardProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  to: string;
  isPopular?: boolean;
  index?: number;
  style?: React.CSSProperties;
};

export const MovieCard = ({ src, alt, width, height, to, isPopular = false, index, style }: MovieCardProps) => {
  return (
    <li className="relative" style={{ width, height, ...style }}>
      <Link to={`${to}`} className="relative block">
        {isPopular && typeof index === 'number' && <PopularBadge index={index} />}
        <LazyImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: style?.borderRadius,
          }}
        />
      </Link>
    </li>
  );
};
