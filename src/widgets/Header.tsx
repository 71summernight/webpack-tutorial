import { Link, useNavigate } from 'react-router-dom';

import { PAGES } from '@/app/routes/paths';
import SearchBar from '@/features/search/components/SearchBar';
import Button from '@/shared/ui/Button';
import BrandLogo from './BrandLogo';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-black flex justify-between items-center py-3 px-10 border-b border-gray-800">
      <div className="flex items-center gap-8 transition-opacity duration-300">
        <BrandLogo onClick={() => navigate(PAGES.home())} />
        <nav>
          <ul className="flex gap-4 py-4">
            <li className="whitespace-nowrap">
              <Link to={PAGES.home()}>Home</Link>
            </li>
            <li className="whitespace-nowrap">
              <Link to={PAGES.search()}>Search</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex gap-4 py-4 items-center">
        <SearchBar />
        <Button onClick={() => {}} className="whitespace-nowrap">
          알람
        </Button>
        <Button onClick={() => {}} className="whitespace-nowrap">
          로그인/회원가입
        </Button>
      </div>
    </header>
  );
};

export default Header;
