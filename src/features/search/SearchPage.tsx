import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGES } from '../../app/routes/paths';
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

  return (
    <div>
      <h1>영화 검색</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="영화 제목으로 검색..."
          value={searchParams.query || ''}
          onChange={(e) => setSearchParams((prev) => ({ ...prev, query: e.target.value }))}
        />
        <button type="submit">검색</button>
      </form>

      {searchParams.query && (
        <>
          {isLoading && <div>검색 중...</div>}
          {error && <div>오류 발생: {error.message}</div>}

          {searchResults && searchResults.results.length > 0 ? (
            <div>
              <h2>검색 결과 ({searchResults.total_results})</h2>
              <ul>
                {searchResults.results.map((movie) => (
                  <li key={movie.id}>
                    <button onClick={() => navigate(PAGES.detail(String(movie.id)))}>
                      {movie.title} ({movie.release_date?.slice(0, 4)})
                    </button>
                    <p>{movie.overview?.slice(0, 100)}...</p>
                  </li>
                ))}
              </ul>

              <div>
                <button
                  onClick={() =>
                    setSearchParams((prev) => ({
                      ...prev,
                      page: Math.max(1, (prev.page || 1) - 1),
                    }))
                  }
                  disabled={(searchParams.page || 1) === 1}
                >
                  이전
                </button>
                <span>
                  페이지 {searchParams.page || 1} / {searchResults.total_pages}
                </span>
                <button
                  onClick={() =>
                    setSearchParams((prev) => ({
                      ...prev,
                      page: (prev.page || 1) + 1,
                    }))
                  }
                  disabled={(searchParams.page || 1) >= searchResults.total_pages}
                >
                  다음
                </button>
              </div>
            </div>
          ) : (
            searchParams.query && <div>검색 결과가 없습니다.</div>
          )}
        </>
      )}
    </div>
  );
}
