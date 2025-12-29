import { PAGES } from '@/app/routes/paths';
import { useMovieGenres } from '@/entities/movie/hooks/useMovieGenres';
import { Movie } from '@/entities/movie/types';
import { MovieCard } from '@/entities/movie/ui/MovieCard';
import { getGenreNames, getPosterUrl } from '@/entities/movie/utils';
import { Link } from 'react-router-dom';

type SearchItemProps = {
  result: Movie;
};

const SearchItem = ({ result }: SearchItemProps) => {
  const { data: movieGenres } = useMovieGenres();

  if (!movieGenres) return <h1>검색결과가 없습니다.</h1>;
  return (
    <Link to={PAGES.detail(result.id)} key={result.id}>
      <li className="flex items-center gap-4 p-2 rounded transition">
        <MovieCard
          src={getPosterUrl(result.poster_path)}
          alt={result.title}
          width={48}
          height={70}
          to={PAGES.detail(result.id)}
          style={{ borderRadius: '5px' }}
        />
        <div className="flex-1">
          <h3 className="font-medium">{result.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {getGenreNames(movieGenres?.genres || [], result.genre_ids) || '영화'} · {result.release_date}
          </p>
        </div>
      </li>
    </Link>
  );
};

export default SearchItem;
