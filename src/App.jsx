// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import IncomePage from "./pages/IncomePage";
import BudgetPage from "./pages/BudgetPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import { CATEGORIES as DEFAULT_CATEGORIES } from "./data/dummyData";
import "./styles/globals.css";

const MONTHS = [
  "ינואר 26",
  "פברואר 26",
  "מרץ 26",
  "אפריל 26",
  "מאי 26",
  "יוני 26",
  "יולי 26",
  "אוגוסט 26",
  "ספטמבר 26",
  "אוקטובר 26",
  "נובמבר 26",
  "דצמבר 26",
];

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function App() {
  // בדיקת session קיים בטעינה
  const [user, setUser] = useState(() => load("trackit_session", null));

  const [allExpenses, setAllExpensesRaw] = useState(() =>
    user ? load(`trackit_expenses_${user.email}`, {}) : {},
  );
  const [allIncome, setAllIncomeRaw] = useState(() =>
    user ? load(`trackit_income_${user.email}`, {}) : {},
  );
  const [categories, setCategoriesRaw] = useState(() =>
    user
      ? load(`trackit_categories_${user.email}`, DEFAULT_CATEGORIES)
      : DEFAULT_CATEGORIES,
  );
  const [activeMonth, setActiveMonthRaw] = useState(() =>
    load("trackit_month", "יוני 26"),
  );

  // שמירה אוטומטית בכל שינוי — לפי המשתמש המחובר
  const setAllExpenses = (fn) => {
    setAllExpensesRaw((prev) => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      if (user) save(`trackit_expenses_${user.email}`, next);
      return next;
    });
  };

  const setAllIncome = (fn) => {
    setAllIncomeRaw((prev) => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      if (user) save(`trackit_income_${user.email}`, next);
      return next;
    });
  };

  const setCategories = (fn) => {
    setCategoriesRaw((prev) => {
      const next = typeof fn === "function" ? fn(prev) : fn;
      if (user) save(`trackit_categories_${user.email}`, next);
      return next;
    });
  };

  const setActiveMonth = (month) => {
    setActiveMonthRaw(month);
    save("trackit_month", month);
  };

  // כניסה — טוען נתונים של המשתמש הספציפי
  const handleLogin = (userData) => {
    setUser(userData);
    save("trackit_session", userData);
    setAllExpensesRaw(load(`trackit_expenses_${userData.email}`, {}));
    setAllIncomeRaw(load(`trackit_income_${userData.email}`, {}));
    setCategoriesRaw(
      load(`trackit_categories_${userData.email}`, DEFAULT_CATEGORIES),
    );
  };

  // יציאה
  const handleLogout = () => {
    localStorage.removeItem("trackit_session");
    setUser(null);
    setAllExpensesRaw({});
    setAllIncomeRaw({});
    setCategoriesRaw(DEFAULT_CATEGORIES);
  };

  const expenses = allExpenses[activeMonth] || [];
  const income = allIncome[activeMonth] || [];

  const setExpenses = (fn) =>
    setAllExpenses((prev) => ({
      ...prev,
      [activeMonth]:
        typeof fn === "function" ? fn(prev[activeMonth] || []) : fn,
    }));

  const setIncome = (fn) =>
    setAllIncome((prev) => ({
      ...prev,
      [activeMonth]:
        typeof fn === "function" ? fn(prev[activeMonth] || []) : fn,
    }));

  const sharedProps = {
    expenses,
    setExpenses,
    income,
    setIncome,
    categories,
    setCategories,
    activeMonth,
    setActiveMonth,
    setAllExpenses,
    setAllIncome,
    user,
    handleLogout,
  };

  // אם לא מחובר — הצג Login
  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
        months={MONTHS}
        expenses={expenses}
        income={income}
        user={user}
        handleLogout={handleLogout}
      >
        <Routes>
          <Route path="/" element={<DashboardPage {...sharedProps} />} />
          <Route path="/expenses" element={<ExpensesPage {...sharedProps} />} />
          <Route path="/income" element={<IncomePage {...sharedProps} />} />
          <Route path="/budget" element={<BudgetPage {...sharedProps} />} />
          <Route
            path="/reports"
            element={
              <ReportsPage
                allExpenses={allExpenses}
                allIncome={allIncome}
                months={MONTHS}
              />
            }
          />
          <Route path="/settings" element={<SettingsPage {...sharedProps} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
