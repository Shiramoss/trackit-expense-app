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
import { supabase } from "./lib/supabase";
import {
  fetchExpenses,
  fetchIncome,
  fetchCategories,
  addExpense,
  updateExpense,
  deleteExpense,
  addIncome,
  updateIncome,
  deleteIncome,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./lib/db";

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

const MONTH_INDEX = Object.fromEntries(MONTHS.map((m, i) => [m, i + 1]));

function monthLabel(dateStr) {
  if (!dateStr) return null;
  const [year, month] = dateStr.split("-");
  const shortYear = year.slice(2);
  const base = MONTHS[parseInt(month) - 1];
  if (!base) return null;
  return base.replace(/\d{2}$/, shortYear);
}

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
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("trackit_dark") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("trackit_dark", darkMode);
  }, [darkMode]);

  const [allExpensesFlat, setAllExpensesFlat] = useState([]);
  const [allIncomeFlat, setAllIncomeFlat] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const [activeMonth, setActiveMonthRaw] = useState(() =>
    load("trackit_month", "יוני 26"),
  );

  // ── AUTH ──────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        setUser({
          id: u.id,
          email: u.email,
          name: u.user_metadata?.name || u.email,
        });
      }
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        return;
      }
      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "INITIAL_SESSION"
      ) {
        if (session?.user) {
          const u = session.user;
          setUser({
            id: u.id,
            email: u.email,
            name: u.user_metadata?.name || u.email,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── LOAD DATA ─────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setAllExpensesFlat([]);
      setAllIncomeFlat([]);
      setCategories(DEFAULT_CATEGORIES);
      return;
    }
    async function loadData() {
      setDataLoading(true);
      try {
        const [exp, inc, cats] = await Promise.all([
          fetchExpenses(),
          fetchIncome(),
          fetchCategories(),
        ]);
        setAllExpensesFlat(exp);
        setAllIncomeFlat(inc);
        setCategories(cats.length > 0 ? cats : DEFAULT_CATEGORIES);
      } catch (err) {
        console.error("שגיאה בטעינת נתונים:", err);
      } finally {
        setDataLoading(false);
      }
    }
    loadData();
  }, [user]);

  // ── פילטור לפי חודש פעיל ─────────────────────────
  const monthNum = MONTH_INDEX[activeMonth];
  const activeYear = 2026;

  const expenses = allExpensesFlat.filter((e) => {
    if (!e.date) return false;
    const [year, month] = e.date.split("-").map(Number);
    return year === activeYear && month === monthNum;
  });

  const income = allIncomeFlat.filter((e) => {
    if (!e.date) return false;
    const [year, month] = e.date.split("-").map(Number);
    return year === activeYear && month === monthNum;
  });

  const allExpenses = allExpensesFlat.reduce((acc, e) => {
    const label = monthLabel(e.date);
    if (!label) return acc;
    acc[label] = [...(acc[label] || []), e];
    return acc;
  }, {});

  const allIncome = allIncomeFlat.reduce((acc, e) => {
    const label = monthLabel(e.date);
    if (!label) return acc;
    acc[label] = [...(acc[label] || []), e];
    return acc;
  }, {});

  // ── EXPENSE HANDLERS ──────────────────────────────
  const handleAddExpense = async (expense) => {
    try {
      const saved = await addExpense(expense);
      setAllExpensesFlat((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("שגיאה בהוספת הוצאה:", err);
    }
  };

  const handleUpdateExpense = async (id, updates) => {
    try {
      const updated = await updateExpense(id, updates);
      setAllExpensesFlat((prev) =>
        prev.map((e) => (e.id === id ? updated : e)),
      );
    } catch (err) {
      console.error("שגיאה בעדכון הוצאה:", err);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setAllExpensesFlat((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("שגיאה במחיקת הוצאה:", err);
    }
  };

  // ── INCOME HANDLERS ───────────────────────────────
  const handleAddIncome = async (item) => {
    try {
      const saved = await addIncome(item);
      setAllIncomeFlat((prev) => [saved, ...prev]);
    } catch (err) {
      console.error("שגיאה בהוספת הכנסה:", err);
    }
  };

  const handleUpdateIncome = async (id, updates) => {
    try {
      const updated = await updateIncome(id, updates);
      setAllIncomeFlat((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (err) {
      console.error("שגיאה בעדכון הכנסה:", err);
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await deleteIncome(id);
      setAllIncomeFlat((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("שגיאה במחיקת הכנסה:", err);
    }
  };

  // ── CATEGORY HANDLERS ─────────────────────────────
  const handleAddCategory = async (category) => {
    try {
      const saved = await addCategory(category);
      setCategories((prev) => [...prev, saved]);
    } catch (err) {
      console.error("שגיאה בהוספת קטגוריה:", err);
    }
  };

  const handleUpdateCategory = async (id, updates) => {
    try {
      const updated = await updateCategory(id, updates);
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error("שגיאה בעדכון קטגוריה:", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("שגיאה במחיקת קטגוריה:", err);
    }
  };

  // ── AUTH HANDLERS ─────────────────────────────────
  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("trackit_session");
    setUser(null);
    setAllExpensesFlat([]);
    setAllIncomeFlat([]);
    setCategories(DEFAULT_CATEGORIES);
  };

  const setActiveMonth = (month) => {
    setActiveMonthRaw(month);
    save("trackit_month", month);
  };

  // ── SHARED PROPS ──────────────────────────────────
  const sharedProps = {
    expenses,
    setExpenses: () => {},
    allExpensesFlat,
    income,
    setIncome: () => {},
    categories,
    setCategories: () => {},
    activeMonth,
    setActiveMonth,
    allExpenses,
    allIncome,
    setAllExpenses: () => {},
    setAllIncome: () => {},
    user,
    handleLogout,
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense,
    handleAddIncome,
    handleUpdateIncome,
    handleDeleteIncome,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    darkMode,
    setDarkMode,
  };

  // ── RENDER ────────────────────────────────────────
  if (authLoading || dataLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
        }}
      >
        טוען...
      </div>
    );
  }

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
