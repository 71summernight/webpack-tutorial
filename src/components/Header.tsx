import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <nav className="flex justify-between items-center">
      <header>HYUNJIN-WATCHA</header>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/search">Search</Link>
        </li>
      </ul>
    </nav>
  );
}
