// src/pages/DashboardPage.jsx
import { MONTHLY_SUMMARY, EXPENSES, CATEGORIES } from '../data/dummyData';
import './DashboardPage.css';

const fmt = (n) => `₪${n.toLocaleString('he-IL', { minimumFractionDigits: 0 })}`;

export default function DashboardPage() {
  const recent = EXPENSES.slice(0, 5);

  const byCategory = CATEGORIES.map(cat => {
    const spent = EXPENSES
      .filter(e => e.category === cat.name)
      .reduce((s, e) => s + e.amount, 0);
    return { ...cat, spent };
  }).filter(c => c.spent > 0).sort((a, b) => b.spent - a.spent).slice(0, 5);

  const balanceGood = MONTHLY_SUMMARY.balance > 0;

  return (
    <div className="dashboard">
      {/* Hero KPI strip */}
      <div className="dash-hero">
        <div className="dash-kpi-card">
          <div className="kpi-label">סך הוצאות</div>
          <div className="kpi-value amount-bad">{fmt(MONTHLY_SUMMARY.totalExpenses)}</div>
          <div className="dash-kpi-sub">מאי 26</div>
        </div>
        <div className="dash-kpi-card">
          <div className="kpi-label">סך הכנסות</div>
          <div className="kpi-value amount-good">{fmt(MONTHLY_SUMMARY.totalIncome)}</div>
          <div className="dash-kpi-sub">מאי 26</div>
        </div>
        <div className="dash-kpi-card">
          <div className="kpi-label">יתרה חודשית</div>
          <div className={`kpi-value ${balanceGood ? 'amount-good' : 'amount-bad'}`}>
            {fmt(MONTHLY_SUMMARY.balance)}
          </div>
          <div className="dash-kpi-sub">
            <span className={`badge ${balanceGood ? 'badge-good' : 'badge-bad'}`}>
              {balanceGood ? '✓ חיובי' : '⚠ שלילי'}
            </span>
          </div>
        </div>
        <div className="dash-kpi-card">
          <div className="kpi-label">קבועות</div>
          <div className="kpi-value">{fmt(MONTHLY_SUMMARY.fixed)}</div>
          <div className="dash-kpi-sub">מתוך {fmt(MONTHLY_SUMMARY.totalExpenses)}</div>
        </div>
      </div>

      <div className="dash-grid">
        {/* עסקאות אחרונות */}
        <div className="card dash-section">
          <div className="card-title">עסקאות אחרונות</div>
          {recent.map(exp => (
            <div key={exp.id} className="expense-row">
              <div className="expense-icon">
                {CATEGORIES.find(c => c.name === exp.category)?.icon || '💳'}
              </div>
              <div className="expense-info">
                <div className="expense-merchant">{exp.merchant}</div>
                <div className="expense-meta">{exp.date} · {exp.category} · {exp.payment}</div>
              </div>
              <div className="expense-amount">-{fmt(exp.amount)}</div>
            </div>
          ))}
        </div>

        {/* הוצאות לפי קטגוריה */}
        <div className="card dash-section">
          <div className="card-title">הוצאות לפי קטגוריה</div>
          {byCategory.map(cat => {
            const pct = cat.budget ? Math.min(100, Math.round(cat.spent / cat.budget * 100)) : null;
            const cls = pct == null ? '' : pct >= 100 ? 'bad' : pct >= 80 ? 'warn' : 'good';
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
          })}
        </div>
      </div>
    </div>
  );
}
