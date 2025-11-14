import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PAGES } from '../../../app/routes/paths';

export default function useHandleKeyword() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [urlSearchParams] = useSearchParams();
  const queryFromUrl = urlSearchParams.get('query') || '';

  const handleSearch = () => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue) {
      navigate(PAGES.search(encodeURIComponent(trimmedValue)));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return {
    handleKeyDown,
    handleSearch,
    searchValue,
    setSearchValue,
    queryFromUrl,
  };
}
