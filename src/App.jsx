// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage  from './pages/ExpensesPage';
import IncomePage    from './pages/IncomePage';
import BudgetPage    from './pages/BudgetPage';
import ReportsPage   from './pages/ReportsPage';
import SettingsPage  from './pages/SettingsPage';
import './styles/globals.css';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"         element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensesPage  />} />
          <Route path="/income"   element={<IncomePage    />} />
          <Route path="/budget"   element={<BudgetPage    />} />
          <Route path="/reports"  element={<ReportsPage   />} />
          <Route path="/settings" element={<SettingsPage  />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
