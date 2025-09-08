import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DashboardContent from './features/Dashboard/DashboardContent';
import Profil from './features/Profil/Profil';
import Expense from './features/Expense/Expense';
import Income from './features/Income/Income';
import HomePage from './pages/HomePage';
import LoginForm from './components/forms/LoginForm';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />}>
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


// Routes recommandées
// <Route path="/" element={<Landing />} />
// <Route path="/login" element={<Login />} />
// <Route path="/signup" element={<Signup />} />

// <Route path="/dashboard" element={<Dashboard />} />
// <Route path="/expenses" element={<ExpensesList />} />
// <Route path="/expenses/new" element={<NewExpense />} />
// <Route path="/expenses/:id/edit" element={<EditExpense />} />
// <Route path="/incomes" element={<IncomesList />} />
// <Route path="/incomes/new" element={<NewIncome />} />
// <Route path="/categories" element={<Categories />} />
// <Route path="/profile" element={<Profile />} />
// <Route path="/receipts/:idExpense" element={<ReceiptView />} />