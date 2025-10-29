import React from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '../app/routes/config';

export default function Header() {
  return (
    <nav>
      <header>HYUNJIN-WATCHA</header>
      <ul>
        {appRoutes.map((route) => (
          <li key={route.id}>
            <Link to={route.link(route.id)}>{route.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
