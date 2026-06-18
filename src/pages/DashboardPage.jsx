// src/pages/DashboardPage.jsx
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const fmt = (n) =>
  `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 0 })}`;

export default function DashboardPage({
  expenses,
  income,
  categories,
  activeMonth,
}) {
  const navigate = useNavigate();
  const recent = expenses.slice(0, 5);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const balance = totalIncome - totalExpenses;
  const isEmpty = expenses.length === 0 && income.length === 0;

  const byCategory = categories
    .map((cat) => {
      const spent = expenses
        .filter((e) => e.category === cat.name)
        .reduce((s, e) => s + e.amount, 0);
      return { ...cat, spent };
    })
    .filter((c) => c.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  if (isEmpty) {
    return (
      <div className="dashboard">
        <div className="dash-welcome">
          <div className="dash-welcome-icon">💳</div>
          <h2 className="dash-welcome-title">ברוכה הבאה ל-TrackIt!</h2>
          <p className="dash-welcome-sub">
            חודש {activeMonth} עדיין ריק — בואי נתחיל לעקוב
          </p>
          <div className="dash-welcome-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/expenses")}
            >
              💸 הוסיפי הוצאה ראשונה
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate("/income")}
            >
              💚 הוסיפי הכנסה
            </button>
          </div>
          <div className="dash-welcome-tips">
            <div className="dash-tip">
              <span className="dash-tip-icon">🎯</span>
              <span>הגדירי תקציב לקטגוריות בעמוד התקציב</span>
            </div>
            <div className="dash-tip">
              <span className="dash-tip-icon">📈</span>
              <span>עברי בין חודשים עם התפריט למעלה</span>
            </div>
            <div className="dash-tip">
              <span className="dash-tip-icon">💾</span>
              <span>הנתונים נשמרים אוטומטית בדפדפן</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Hero KPI strip */}
      <div className="dash-hero">
        <div className="dash-kpi-card kpi-expenses">
          <div className="kpi-label">סך הוצאות</div>
          <div className="kpi-value amount-bad">{fmt(totalExpenses)}</div>
          <div className="dash-kpi-sub">{activeMonth}</div>
        </div>
        <div className="dash-kpi-card kpi-income">
          <div className="kpi-label">סך הכנסות</div>
          <div className="kpi-value amount-good">{fmt(totalIncome)}</div>
          <div className="dash-kpi-sub">{activeMonth}</div>
        </div>
        <div className="dash-kpi-card kpi-balance">
          <div className="kpi-label">יתרה חודשית</div>
          <div
            className={`kpi-value ${balance >= 0 ? "amount-good" : "amount-bad"}`}
          >
            {fmt(Math.abs(balance))}
          </div>
          <div className="dash-kpi-sub">
            <span
              className={`badge ${balance >= 0 ? "badge-good" : "badge-bad"}`}
            >
              {balance >= 0 ? "✓ חיובי" : "⚠ שלילי"}
            </span>
          </div>
        </div>
        <div className="dash-kpi-card kpi-count">
          <div className="kpi-label">מספר הוצאות</div>
          <div className="kpi-value">{expenses.length}</div>
          <div className="dash-kpi-sub">עסקאות</div>
        </div>
      </div>

      <div className="dash-grid">
        {/* עסקאות אחרונות */}
        <div className="card dash-section">
          <div className="card-title">עסקאות אחרונות</div>
          {recent.map((exp) => (
            <div key={exp.id} className="expense-row">
              <div className="expense-icon">
                {categories.find((c) => c.name === exp.category)?.icon || "💳"}
              </div>
              <div className="expense-info">
                <div className="expense-merchant">{exp.merchant}</div>
                <div className="expense-meta">
                  {exp.date} · {exp.category}
                </div>
              </div>
              <div className="expense-amount">-{fmt(exp.amount)}</div>
            </div>
          ))}
        </div>

        {/* הוצאות לפי קטגוריה */}
        <div className="card dash-section">
          <div className="card-title">הוצאות לפי קטגוריה</div>
          {byCategory.length === 0 ? (
            <div className="exp-empty">עדיין אין נתונים להצגה</div>
          ) : (
            byCategory.map((cat) => {
              const pct = cat.budget
                ? Math.min(100, Math.round((cat.spent / cat.budget) * 100))
                : null;
              const cls =
                pct == null
                  ? ""
                  : pct >= 100
                    ? "bad"
                    : pct >= 80
                      ? "warn"
                      : "good";
              return (
                <div key={cat.name} className="dash-cat-row">
                  <div className="dash-cat-info">
                    <span className="dash-cat-icon">{cat.icon}</span>
                    <span className="dash-cat-name">{cat.name}</span>
                  </div>
                  <div className="dash-cat-right">
                    <span className="dash-cat-amount">{fmt(cat.spent)}</span>
                    {cat.budget && (
                      <span className={`badge badge-${cls}`}>{pct}%</span>
                    )}
                  </div>
                  {cat.budget && (
                    <div className="dash-cat-bar">
                      <div className="progress-track">
                        <div
                          className={`progress-fill ${cls}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
