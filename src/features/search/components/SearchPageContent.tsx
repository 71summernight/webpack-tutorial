import useHandleKeyword from '../hooks/useHandleKeyword';
import { useMovieSearch } from '../hooks/useMovieSearch';
import SearchItem from './SearchItem';

const SearchPageContent = () => {
  const { searchQuery } = useHandleKeyword();
  const { data: searchResults } = useMovieSearch(searchQuery ? { query: searchQuery } : undefined);

  const { results } = searchResults;

  if (results.length === 0) {
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
        {results.map((result) => (
          <SearchItem key={result.id} result={result} />
        ))}
      </ul>
    </div>
  );
};

export default SearchPageContent;
