// src/pages/ReportsPage.jsx
import { YEARLY_DATA } from '../data/dummyData';
import './ReportsPage.css';

const fmt = (n) => `₪${Math.abs(n).toLocaleString('he-IL')}`;

export default function ReportsPage() {
  const maxExpense = Math.max(...YEARLY_DATA.map(m => m.expenses));
  const totalExp   = YEARLY_DATA.reduce((s, m) => s + m.expenses, 0);
  const totalInc   = YEARLY_DATA.reduce((s, m) => s + m.income,   0);
  const totalBal   = YEARLY_DATA.reduce((s, m) => s + m.balance,  0);

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1 className="exp-title">דוחות שנתיים</h1>
        <p className="exp-subtitle">סיכום הוצאות והכנסות לפי חודשים · 2025–2026</p>
      </div>

      {/* Yearly KPIs */}
      <div className="reports-kpis">
        <div className="card reports-kpi">
          <div className="kpi-label">סך הוצאות השנה</div>
          <div className="kpi-value amount-bad">{fmt(totalExp)}</div>
        </div>
        <div className="card reports-kpi">
          <div className="kpi-label">סך הכנסות השנה</div>
          <div className="kpi-value amount-good">{fmt(totalInc)}</div>
        </div>
        <div className="card reports-kpi">
          <div className="kpi-label">יתרה מצטברת</div>
          <div className={`kpi-value ${totalBal >= 0 ? 'amount-good' : 'amount-bad'}`}>
            {totalBal >= 0 ? '+' : '-'}{fmt(totalBal)}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card">
        <div className="card-title">הוצאות חודשיות</div>
        <div className="bar-chart">
          {YEARLY_DATA.map(m => {
            const h = Math.round((m.expenses / maxExpense) * 100);
            return (
              <div key={m.month} className="bar-col">
                <div className="bar-value">{fmt(m.expenses)}</div>
                <div className="bar-wrap">
                  <div className="bar-fill" style={{ height: `${h}%` }} />
                </div>
                <div className="bar-label">{m.month.replace(' 26', '').replace(' 25', '')}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly table */}
      <div className="card">
        <div className="card-title">פירוט חודשי</div>
        <div className="reports-table">
          <div className="reports-thead">
            <div>חודש</div>
            <div>הוצאות</div>
            <div>הכנסות</div>
            <div>יתרה</div>
          </div>
          {YEARLY_DATA.map(m => (
            <div key={m.month} className="reports-trow">
              <div className="reports-month">{m.month}</div>
              <div className="amount-bad">{fmt(m.expenses)}</div>
              <div className="amount-good">{m.income > 0 ? fmt(m.income) : '—'}</div>
              <div className={m.balance >= 0 ? 'amount-good' : 'amount-bad'}>
                {m.balance >= 0 ? '+' : '-'}{fmt(m.balance)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
