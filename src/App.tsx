import React from 'react';
import './styles.css';

interface Welcome {
  title: string;
  subtitle: string;
}

interface AppProps {
  darkMode?: boolean;
}

const WelcomeComponent: React.FC<Welcome> = ({ title, subtitle }) => (
  <div className="welcome-container">
    <h1>{title}</h1>
    <p>{subtitle}</p>
  </div>
);

const App: React.FC<AppProps> = ({ darkMode = false }) => {
  const welcomeData: Welcome = {
    title: 'Hello, Webpack with React and TypeScript!',
    subtitle: 'Code Review Automation Test - 모든 리뷰 도구가 한글로 설정됨',
  };

  const appClassName = darkMode ? 'app-dark' : 'app-light';

  return (
    <div className={appClassName}>
      <WelcomeComponent {...welcomeData} />
      <footer>
        <p>© 2024 Code Review Automation Demo</p>
      </footer>
    </div>
  );
};

export default App;
