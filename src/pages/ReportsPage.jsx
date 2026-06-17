// src/pages/ReportsPage.jsx
import "./ReportsPage.css";

const fmt = (n) => `₪${Math.abs(n).toLocaleString("he-IL")}`;

export default function ReportsPage({ allExpenses, allIncome, months }) {
  const safeMonths = months || [];
  const safeExpenses = allExpenses || {};
  const safeIncome = allIncome || {};

  const monthlyData = safeMonths
    .map((month) => {
      const exp = (safeExpenses[month] || []).reduce((s, e) => s + e.amount, 0);
      const inc = (safeIncome[month] || []).reduce((s, i) => s + i.amount, 0);
      return { month, expenses: exp, income: inc, balance: inc - exp };
    })
    .filter((m) => m.expenses > 0 || m.income > 0);

  const hasData = monthlyData.length > 0;
  const maxExpense = hasData
    ? Math.max(...monthlyData.map((m) => m.expenses), 1)
    : 1;
  const totalExp = monthlyData.reduce((s, m) => s + m.expenses, 0);
  const totalInc = monthlyData.reduce((s, m) => s + m.income, 0);
  const totalBal = totalInc - totalExp;

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1 className="exp-title">דוחות</h1>
        <p className="exp-subtitle">סיכום הוצאות והכנסות לפי חודשים</p>
      </div>

      {/* KPIs */}
      <div className="reports-kpis">
        <div className="card reports-kpi">
          <div className="kpi-label">סך הוצאות</div>
          <div className="kpi-value amount-bad">{fmt(totalExp)}</div>
        </div>
        <div className="card reports-kpi">
          <div className="kpi-label">סך הכנסות</div>
          <div className="kpi-value amount-good">{fmt(totalInc)}</div>
        </div>
        <div className="card reports-kpi">
          <div className="kpi-label">יתרה מצטברת</div>
          <div
            className={`kpi-value ${totalBal >= 0 ? "amount-good" : "amount-bad"}`}
          >
            {totalBal >= 0 ? "+" : "-"}
            {fmt(totalBal)}
          </div>
        </div>
      </div>

      {/* גרף */}
      <div className="card">
        <div className="card-title">הוצאות לפי חודש</div>
        {!hasData ? (
          <div className="exp-empty">
            עדיין אין נתונים — הוסיפי הוצאות כדי לראות את הגרף
          </div>
        ) : (
          <div className="bar-chart">
            {monthlyData.map((m) => {
              const h = Math.round((m.expenses / maxExpense) * 100);
              return (
                <div key={m.month} className="bar-col">
                  <div className="bar-value">
                    {m.expenses > 0 ? fmt(m.expenses) : ""}
                  </div>
                  <div className="bar-wrap">
                    <div
                      className="bar-fill"
                      style={{ height: `${Math.max(h, 2)}%` }}
                    />
                  </div>
                  <div className="bar-label">{m.month.split(" ")[0]}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* טבלה */}
      <div className="card">
        <div className="card-title">פירוט חודשי</div>
        {!hasData ? (
          <div className="exp-empty">אין נתונים להצגה עדיין</div>
        ) : (
          <div className="reports-table">
            <div className="reports-thead">
              <div>חודש</div>
              <div>הוצאות</div>
              <div>הכנסות</div>
              <div>יתרה</div>
            </div>
            {monthlyData.map((m) => (
              <div key={m.month} className="reports-trow">
                <div className="reports-month">{m.month}</div>
                <div className="amount-bad">
                  {m.expenses > 0 ? fmt(m.expenses) : "—"}
                </div>
                <div className="amount-good">
                  {m.income > 0 ? fmt(m.income) : "—"}
                </div>
                <div className={m.balance >= 0 ? "amount-good" : "amount-bad"}>
                  {m.expenses > 0 || m.income > 0
                    ? `${m.balance >= 0 ? "+" : "-"}${fmt(m.balance)}`
                    : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
