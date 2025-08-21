import './App.css'
// App.tsx
import TestColor from './assets/component/TestColor';

const App: React.FC = () => {
  return (
    <div>
      <h1>Bienvenue dans l’app de gestion de dépenses</h1>
      <TestColor />
    </div>
  );
};

export default App;
