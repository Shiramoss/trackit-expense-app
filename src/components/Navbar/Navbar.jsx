// src/components/Navbar/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const TABS = [
  { path: "/", label: "דשבורד", icon: "📊", color: "var(--c-dashboard)" },
  {
    path: "/expenses",
    label: "הוצאות",
    icon: "💸",
    color: "var(--c-expenses)",
  },
  { path: "/income", label: "הכנסות", icon: "💚", color: "var(--c-income)" },
  { path: "/budget", label: "תקציב", icon: "🎯", color: "var(--c-budget)" },
  { path: "/reports", label: "דוחות", icon: "📈", color: "var(--c-reports)" },
  {
    path: "/settings",
    label: "הגדרות",
    icon: "⚙️",
    color: "var(--c-settings)",
  },
];

const fmt = (n) => `₪${n.toLocaleString("he-IL")}`;

export default function Navbar({
  activeMonth,
  setActiveMonth,
  months,
  expenses,
  income,
  user,
  handleLogout,
}) {
  const location = useLocation();

  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const totalInc = income.reduce((s, i) => s + i.amount, 0);
  const balance = totalInc - totalExp;

  return (
    <header className="navbar-wrapper">
      <div className="topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-icon">💳</div>
          <span>TrackIt</span>
        </div>

        <div className="topbar-month-picker">
          <select
            className="month-select"
            value={activeMonth}
            onChange={(e) => setActiveMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="topbar-spacer" />

        <div className="topbar-kpis">
          <div className="topbar-kpi">
            <span className="topbar-kpi-label">הוצאות</span>
            <span className="topbar-kpi-value amount-bad">{fmt(totalExp)}</span>
          </div>
          <div className="topbar-kpi">
            <span className="topbar-kpi-label">הכנסות</span>
            <span className="topbar-kpi-value amount-good">
              {fmt(totalInc)}
            </span>
          </div>
          <div className="topbar-kpi">
            <span className="topbar-kpi-label">יתרה</span>
            <span
              className={`topbar-kpi-value ${balance >= 0 ? "amount-good" : "amount-bad"}`}
            >
              {fmt(Math.abs(balance))}
            </span>
          </div>
        </div>

        {/* משתמש + יציאה */}
        <div className="topbar-user">
          <span className="topbar-user-name">
            👤 {user?.name || user?.email}
          </span>
          <button
            className="btn btn-sm btn-secondary topbar-logout"
            onClick={handleLogout}
          >
            יציאה
          </button>
        </div>
      </div>

      <nav className="pill-nav">
        <div className="pill-nav-inner">
          {TABS.map((tab) => {
            const active = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`pill-tab ${active ? "active" : ""}`}
                style={active ? { "--tab-color": tab.color } : {}}
              >
                <span className="pill-tab-icon">{tab.icon}</span>
                <span className="pill-tab-label">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
