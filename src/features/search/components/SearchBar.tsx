import { useNavigate } from 'react-router-dom';
import { PAGES } from '../../../app/routes/paths';
import SearchIcon from '../../../widgets/SearchIcon';
import useHandleKeyword from '../hooks/useHandleKeyword';

export default function SearchBar() {
  const navigate = useNavigate();
  const { handleSearch, handleKeyDown, searchValue, setSearchValue, queryFromUrl } = useHandleKeyword();

  return (
    <div className="flex gap-2 bg-gray-800 rounded-md p-2 w-64">
      <button onClick={handleSearch} type="button">
        <SearchIcon />
      </button>
      <input
        className="w-full cursor-pointer"
        type="text"
        placeholder="Search"
        onChange={(e) => setSearchValue(e.target.value)}
        onClick={queryFromUrl ? () => undefined : () => navigate(PAGES.search())}
        value={searchValue}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
