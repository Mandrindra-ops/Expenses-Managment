import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardContent from './pages/Dashboard/DashboardContent';
import Profil from './pages/Profil/Profil';
import Expense from './pages/Expense/Expense';
import Income from './pages/Income/Income';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<DashboardContent />} />
            <Route path="profile" element={<Profil />} />
            <Route path="expenses" element={<Expense />} />
            <Route path="incomes" element={<Income />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;

// aza alana ty commentaire ity
// import { Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import LoginForm from './components/forms/LoginForm';

// const App: React.FC = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/login" element={<LoginForm />} />
//     </Routes>
//   );
// };

// export default App;