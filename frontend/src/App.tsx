import './App.css'
// App.tsx
import TestColor from './assets/component/TestColor';
import Login from './assets/component/forms/LoginForm';

const App: React.FC = () => {
  return (
    <div className="grid w-[100%] h-screen place-items-center bg-cyan-400">
      <Login />
    </div>
  );
};

export default App;
