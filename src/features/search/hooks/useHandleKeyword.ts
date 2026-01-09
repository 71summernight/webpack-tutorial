import { PAGES } from '@/app/routes/paths';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

type UseHandleKeywordReturn = {
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
};

type UseHandleKeywordHook = () => UseHandleKeywordReturn;
const useHandleKeyword: UseHandleKeywordHook = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [urlSearchParams] = useSearchParams();
  const searchQuery = urlSearchParams.get('query') || '';

  type HandleSearchFn = () => void;
  const handleSearch: HandleSearchFn = () => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue) {
      navigate(PAGES.search(encodeURIComponent(trimmedValue)));
    }
  };

  type HandleKeyDownFn = (e: React.KeyboardEvent<HTMLInputElement>) => void;
  const handleKeyDown: HandleKeyDownFn = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return {
    handleKeyDown,
    handleSearch,
    searchValue,
    setSearchValue,
    searchQuery,
  };
};

export default useHandleKeyword;
