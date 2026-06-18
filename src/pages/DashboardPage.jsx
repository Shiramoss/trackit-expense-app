// src/pages/DashboardPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import "./DashboardPage.css";

const fmt = (n) =>
  `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 0 })}`;
const COLORS = [
  "#6366f1",
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#ec4899",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 700,
        direction: "rtl",
      }}
    >
      {label && (
        <div style={{ color: "#64748b", marginBottom: 4 }}>{label}</div>
      )}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.fill }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function DashboardPage({
  expenses,
  income,
  categories,
  activeMonth,
}) {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState("pie");

  const recent = expenses.slice(0, 5);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = income.reduce((s, i) => s + i.amount, 0);
  const balance = totalIncome - totalExpenses;
  const isEmpty = expenses.length === 0 && income.length === 0;

  // נתונים לגרף עוגה ועמודות
  const byCategory = categories
    .map((cat, i) => {
      const value = expenses
        .filter((e) => e.category === cat.name)
        .reduce((s, e) => s + e.amount, 0);
      return {
        name: cat.name,
        value,
        icon: cat.icon,
        fill: COLORS[i % COLORS.length],
      };
    })
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);

  // נתונים לציר זמן — לפי יום
  const byDay = expenses
    .reduce((acc, e) => {
      const date = e.date || "";
      const existing = acc.find((d) => d.date === date);
      if (existing) existing.value += e.amount;
      else acc.push({ date, value: e.amount });
      return acc;
    }, [])
    .sort((a, b) => a.date.localeCompare(b.date));

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
              <span className="dash-tip-icon">📅</span>
              <span>הוסיפי הוצאה עם תאריך מחודש אחר — היא תועבר אוטומטית</span>
            </div>
            <div className="dash-tip">
              <span className="dash-tip-icon">💾</span>
              <span>הנתונים נשמרים אוטומטית — גם אחרי סגירת הדפדפן</span>
            </div>
            <div className="dash-tip">
              <span className="dash-tip-icon">👤</span>
              <span>הנתונים שלך פרטיים — מחוברים לחשבון שלך בלבד</span>
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

      {/* גרף אינטראקטיבי */}
      <div className="card dash-chart-card">
        <div className="dash-chart-header">
          <div className="card-title" style={{ margin: 0 }}>
            ניתוח הוצאות
          </div>
          <select
            className="select dash-chart-select"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="pie">🥧 גרף עוגה</option>
            <option value="bar">📊 גרף עמודות</option>
            <option value="line">📈 ציר זמן</option>
          </select>
        </div>

        {byCategory.length === 0 ? (
          <div className="exp-empty">עדיין אין נתונים להצגה</div>
        ) : (
          <>
            {/* גרף עוגה */}
            {chartType === "pie" && (
              <div className="dash-chart-content">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={byCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {byCategory.map((entry, i) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {byCategory.map((cat, i) => (
                    <div key={cat.name} className="pie-legend-item">
                      <div
                        className="pie-legend-dot"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span className="pie-legend-name">
                        {cat.icon} {cat.name}
                      </span>
                      <span className="pie-legend-value">{fmt(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* גרף עמודות */}
            {chartType === "bar" && (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={byCategory}
                  margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `₪${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="הוצאה" radius={[6, 6, 0, 0]}>
                    {byCategory.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* ציר זמן */}
            {chartType === "line" && (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={byDay}
                  margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickFormatter={(v) => `₪${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="הוצאה"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ fill: "#6366f1", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </>
        )}
      </div>

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
    </div>
  );
}
