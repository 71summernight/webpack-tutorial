import './styles.css';

interface Welcome {
  title: string;
  subtitle: string;
  author?: string;
}

interface AppConfig {
  enableDarkMode: boolean;
}

function App() {
  const config: AppConfig = {
    enableDarkMode: false,
  };

  const welcomeData: Welcome = {
    title: 'Hello, Webpack with React and TypeScript!',
    subtitle: '자동화된 코드리뷰 데모',
    author: 'Code Review Automation',
  };

  const getStyles = () => ({
    container: {
      padding: '20px',
      backgroundColor: config.enableDarkMode ? '#1a1a1a' : '#ffffff',
      color: config.enableDarkMode ? '#ffffff' : '#000000',
    },
  });

  const styles = getStyles();

  return (
    <div style={styles.container}>
      <h1>{welcomeData.title}</h1>
      <p>{welcomeData.subtitle}</p>
      {welcomeData.author && <small>By {welcomeData.author}</small>}
    </div>
  );
}

export default App;
