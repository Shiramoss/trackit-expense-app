// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import IncomePage from "./pages/IncomePage";
import BudgetPage from "./pages/BudgetPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
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

export default function App() {
  const [allExpenses, setAllExpenses] = useState(() =>
    load("trackit_expenses", {}),
  );
  const [allIncome, setAllIncome] = useState(() => load("trackit_income", {}));
  const [categories, setCategories] = useState(() =>
    load("trackit_categories", DEFAULT_CATEGORIES),
  );
  const [activeMonth, setActiveMonth] = useState(() =>
    load("trackit_month", "יוני 26"),
  );

  // שמירה אוטומטית בכל שינוי
  useEffect(() => {
    localStorage.setItem("trackit_expenses", JSON.stringify(allExpenses));
  }, [allExpenses]);
  useEffect(() => {
    localStorage.setItem("trackit_income", JSON.stringify(allIncome));
  }, [allIncome]);
  useEffect(() => {
    localStorage.setItem("trackit_categories", JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem("trackit_month", JSON.stringify(activeMonth));
  }, [activeMonth]);

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
  };

  return (
    <BrowserRouter>
      <Layout
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
        months={MONTHS}
        expenses={expenses}
        income={income}
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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
