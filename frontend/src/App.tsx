import { Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DashboardContent from "./features/Dashboard/DashboardContent";
import Profil from "./features/Profil/Profil";
import HomePage from "./pages/HomePage";
import LoginForm from "./components/forms/LoginForm";
import IncomeContent from "./features/Income/IncomeContent";
import ExpenseContent from "./features/Expense/ExpenseContent";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm mode="login" />} />
          <Route path="/signup" element={<LoginForm mode="signup" />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardContent />} />
            <Route path="profile" element={<Profil />} />
            <Route path="expenses" element={<Expense />} />
            <Route path="incomes">
              <Route index element={<IncomeContent />} />
              <Route path="new" element={<IncomeContent mode="create" />} />
            </Route>
            <Route path="categories" element={<CategoryContent />} />
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

// <Route path="/expenses" element={<ExpensesList />} />
// <Route path="/expenses/new" element={<NewExpense />} />
// <Route path="/expenses/:id/edit" element={<EditExpense />} />
// <Route path="/categories" element={<Categories />} />
// <Route path="/profile" element={<Profile />} />
// <Route path="/receipts/:idExpense" element={<ReceiptView />} />
