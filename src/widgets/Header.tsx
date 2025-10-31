import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center gap-8">
        <h1 className="bg-primary">HYUNJIN-WATCHA</h1>
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/search">Search</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex gap-4">
        <button>검색</button>
        <button>알람</button>
        <button>로그인/회원가입</button>
      </div>
    </header>
  );
}
