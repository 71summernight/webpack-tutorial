import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchParams } from '../../entities/movie/types';
import { useMovieSearch } from './hooks/useMovieSearch';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    page: 1,
  });

  const { data: searchResults, isLoading, error } = useMovieSearch(searchParams.query ? searchParams : undefined);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams((prev) => ({ ...prev, page: 1 }));
  };

  return <div>SearchPage</div>;
}
