import SearchIcon from '../../../widgets/SearchIcon';

export default function SearchBar() {
  return (
    <div className="flex gap-2 bg-gray-800 rounded-md p-2 w-64">
      <button>
        <SearchIcon />
      </button>
      <input type="text" placeholder="Search" />
    </div>
  );
}
