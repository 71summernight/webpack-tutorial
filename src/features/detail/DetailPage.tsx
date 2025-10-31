import { useNavigate, useParams } from 'react-router-dom';
import { useMovieDetail } from './hooks/useMovieDetail';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = id ? Number(id) : undefined;

  const { data: movie, isLoading, error } = useMovieDetail(movieId);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;
  if (!movie) return <div>영화를 찾을 수 없습니다.</div>;

  return <div>DatilPage</div>;
}
