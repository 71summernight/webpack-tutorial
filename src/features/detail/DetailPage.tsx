import { useParams } from 'react-router-dom';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Detail Page - ID: {id}</h1>
    </div>
  );
}
