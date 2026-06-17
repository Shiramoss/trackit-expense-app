// src/pages/BudgetPage.jsx
import "./BudgetPage.css";

const fmt = (n) => `₪${n.toLocaleString("he-IL")}`;

export default function BudgetPage({ expenses, categories }) {
  const withBudget = categories.filter((c) => c.budget != null);

  const rows = withBudget.map((cat) => {
    const spent = expenses
      .filter((e) => e.category === cat.name)
      .reduce((s, e) => s + e.amount, 0);
    const pct = Math.min(100, Math.round((spent / cat.budget) * 100));
    const left = cat.budget - spent;
    const cls = pct >= 100 ? "bad" : pct >= 80 ? "warn" : "good";
    return { ...cat, spent, pct, left, cls };
  });

  return (
    <div className="budget-page">
      <div className="budget-header">
        <h1 className="exp-title">תקציב</h1>
        <p className="exp-subtitle">מעקב אחר יעדי ההוצאה החודשיים שלך</p>
      </div>

      {rows.length === 0 ? (
        <div className="card">
          <div className="exp-empty">
            אין קטגוריות עם תקציב מוגדר — עברי להגדרות כדי להוסיף
          </div>
        </div>
      ) : (
        <div className="budget-grid">
          {rows.map((row) => (
            <div
              key={row.name}
              className={`card budget-card budget-card-${row.cls}`}
            >
              <div className="budget-card-top">
                <div className="budget-card-left">
                  <span className="budget-icon">{row.icon}</span>
                  <div>
                    <div className="budget-cat-name">{row.name}</div>
                    <div className="budget-cat-meta">
                      יעד: {fmt(row.budget)}
                    </div>
                  </div>
                </div>
                <div className={`badge badge-${row.cls}`}>{row.pct}%</div>
              </div>

              <div className="progress-track" style={{ marginBottom: 8 }}>
                <div
                  className={`progress-fill ${row.cls}`}
                  style={{ width: `${row.pct}%` }}
                />
              </div>

              <div className="budget-card-stats">
                <div className="budget-stat">
                  <span>הוצא</span>
                  <strong className="amount-bad">{fmt(row.spent)}</strong>
                </div>
                <div className="budget-stat">
                  <span>{row.left >= 0 ? "נותר" : "חריגה"}</span>
                  <strong
                    className={row.left >= 0 ? "amount-good" : "amount-bad"}
                  >
                    {fmt(Math.abs(row.left))}
                  </strong>
                </div>
                <div className="budget-stat">
                  <span>יעד</span>
                  <strong>{fmt(row.budget)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="card-title">קטגוריות ללא תקציב מוגדר</div>
        {categories.filter((c) => c.budget == null).length === 0 ? (
          <div className="exp-empty">כל הקטגוריות עם תקציב מוגדר</div>
        ) : (
          <div className="nobud-list">
            {categories
              .filter((c) => c.budget == null)
              .map((cat) => {
                const spent = expenses
                  .filter((e) => e.category === cat.name)
                  .reduce((s, e) => s + e.amount, 0);
                return (
                  <div key={cat.name} className="nobud-row">
                    <span className="nobud-icon">{cat.icon}</span>
                    <span className="nobud-name">{cat.name}</span>
                    <span className="nobud-amount">
                      {spent > 0 ? fmt(spent) : "—"}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
