import SearchItem from './components/SearchItem';
import useHandleKeyword from './hooks/useHandleKeyword';
import { useMovieSearch } from './hooks/useMovieSearch';

export default function SearchPage() {
  const { queryFromUrl } = useHandleKeyword();
  const { data: searchResults } = useMovieSearch(queryFromUrl ? { query: queryFromUrl } : undefined);

  if (searchResults?.results.length === 0) {
    return (
      <div className="px-10">
        <h1>검색 결과가 없습니다.</h1>
      </div>
    );
  }

  return (
    <div className="px-10">
      <h1>Search Results</h1>
      <ul className="space-y-2">
        {searchResults.results.map((result) => (
          <SearchItem key={result.id} result={result} />
        ))}
      </ul>
    </div>
  );
}
