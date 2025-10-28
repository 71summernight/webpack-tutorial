import React from 'react';
import './styles.css';

interface Welcome {
  title: string;
  subtitle: string;
}

const App: React.FC = () => {
  const welcomeData: Welcome = {
    title: 'Hello, Webpack with React and TypeScript!',
    subtitle: 'SonarCloud + Claude AI 코드리뷰 데모',
  };

  return (
    <div>
      <h1>{welcomeData.title}</h1>
      <p>{welcomeData.subtitle}</p>
    </div>
  );
};

export default App;
