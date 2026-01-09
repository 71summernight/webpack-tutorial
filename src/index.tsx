import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { initializeInterceptors } from './shared/api/interceptors';
import './styles/tailwind.css';

// 앱 초기화: 모든 HTTP interceptor 설정
initializeInterceptors();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
