import { useNavigate } from 'react-router-dom';
import { PAGES } from '../../app/router';

// 더미 데이터
const items = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
];

export function ListPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>List</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button onClick={() => navigate(PAGES.detail(item.id))}>{item.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
