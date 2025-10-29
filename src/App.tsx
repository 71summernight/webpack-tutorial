import './styles.css';

interface Welcome {
  title: string;
  subtitle: string;
}

function App() {
  const welcomeData: Welcome = {
    title: 'Hello, Webpack with React and TypeScript!',
    subtitle: 'Code Review Automation Test',
  };

  return (
    <div>
      <h1>{welcomeData.title}</h1>
      <p>{welcomeData.subtitle}</p>
    </div>
  );
}

export default App;
