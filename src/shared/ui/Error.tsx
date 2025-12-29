import { useNavigate } from 'react-router-dom';

import { PAGES } from '@/app/routes/paths';
import Button from './Button';

type ErrorProps = {
  error?: Error;
  onRetry?: () => void;
};

const ErrorPage = ({ error, onRetry }: ErrorProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen text-center text-white">
      <h1 className="text-4xl font-bold mb-4">요청 실패</h1>
      <p className="text-xl mb-2">{error?.message || '요청을 수행할 수 없습니다.'}</p>
      <p className="text-lg mb-8">잠시 후 다시 시도해주세요.</p>
      <div className="flex gap-4">
        {onRetry && <Button onClick={onRetry} text="다시 시도" />}
        <Button onClick={() => navigate(PAGES.home())} text="홈으로 돌아가기" />
      </div>
    </div>
  );
};

export default ErrorPage;
