import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginForm from './components/forms/LoginForm';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default App;