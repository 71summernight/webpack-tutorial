import { Link, useNavigate } from 'react-router-dom';

import { PAGES } from '../app/routes/paths';
import SearchBar from '../features/search/components/SearchBar';
import Button from '../shared/ui/Button';
import BrandLogo from './BrandLogo';

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-black flex justify-between items-center py-3 px-10 border-b border-gray-800">
      <div className="flex items-center gap-8 transition-opacity duration-300">
        <BrandLogo onClick={() => navigate(PAGES.home())} />
        <nav>
          <ul className="flex gap-4 py-4">
            <li>
              <Link to={PAGES.home()}>Home</Link>
            </li>
            <li>
              <Link to={PAGES.search()}>Search</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex gap-4 py-4">
        <SearchBar />
        <Button onClick={() => {}}>알람</Button>
        <Button onClick={() => {}}>로그인/회원가입</Button>
      </div>
    </header>
  );
}
