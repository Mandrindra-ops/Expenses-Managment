import './App.css'
// App.tsx
import TestColor from './assets/components/TestColor';
import Login from './assets/components/forms/LoginForm';

const App: React.FC = () => {
  return (
    <div className="grid w-[100%] h-screen place-items-center bg-cyan-400">
      <Login />
    </div>
  );
};

export default App;
