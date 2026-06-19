// src/pages/IncomePage.jsx
import { useState } from "react";
import "./IncomePage.css";

const fmt = (n) => `₪${n.toLocaleString("he-IL")}`;

export default function IncomePage({
  income,
  expenses,
  activeMonth,
  setActiveMonth,
  handleAddIncome,
  handleDeleteIncome,
}) {
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ source: "", amount: "", date: "" });

  const total = income.reduce((s, i) => s + i.amount, 0);
  const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
  const balance = total - totalExp;

  const handleAdd = async () => {
    setFormError("");
    if (!form.source.trim()) {
      setFormError("נא למלא מקור הכנסה");
      return;
    }
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      setFormError("נא למלא סכום תקין וחיובי");
      return;
    }

    const dateStr = form.date || new Date().toISOString().split("T")[0];

    const heMonths = [
      "ינואר",
      "פברואר",
      "מרץ",
      "אפריל",
      "מאי",
      "יוני",
      "יולי",
      "אוגוסט",
      "ספטמבר",
      "אוקטובר",
      "נובמבר",
      "דצמבר",
    ];
    const d = new Date(dateStr);
    const targetMonth = `${heMonths[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
    if (targetMonth !== activeMonth) {
      setActiveMonth(targetMonth);
    }

    setSaving(true);
    await handleAddIncome({
      source: form.source.trim(),
      amount: parseFloat(form.amount),
      date: dateStr,
    });
    setSaving(false);

    setForm({ source: "", amount: "", date: "" });
    setFormError("");
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await handleDeleteIncome(id);
  };

  return (
    <div className="income-page">
      <div className="income-hero">
        <div className="income-hero-main">
          <div className="kpi-label">סך הכנסות</div>
          <div className="kpi-value amount-good">{fmt(total)}</div>
          <div className="income-hero-sub">{income.length} מקורות הכנסה</div>
        </div>
        <div className="income-hero-stats">
          <div className="income-stat">
            <span className="income-stat-label">הוצאות</span>
            <span className="income-stat-value amount-bad">
              {fmt(totalExp)}
            </span>
          </div>
          <div className="income-stat">
            <span className="income-stat-label">יתרה</span>
            <span
              className={`income-stat-value ${balance >= 0 ? "amount-good" : "amount-bad"}`}
            >
              {fmt(Math.abs(balance))}
            </span>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm((s) => !s);
            setFormError("");
          }}
        >
          {showForm ? "✕" : "+ הכנסה"}
        </button>
      </div>

      {showForm && (
        <div className="card income-form">
          <div className="card-title">הכנסה חדשה</div>
          <div className="income-form-grid">
            <div className="field">
              <label className="field-label">מקור</label>
              <input
                className="input"
                placeholder="לדוגמה: משכורת"
                value={form.source}
                onChange={(e) =>
                  setForm((p) => ({ ...p, source: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label className="field-label">סכום (₪)</label>
              <input
                className="input"
                type="number"
                placeholder="0"
                min="0"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label className="field-label">תאריך</label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
              />
            </div>
          </div>
          {formError && (
            <div className="login-error" style={{ marginBottom: 10 }}>
              {formError}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={saving}
            >
              {saving ? "שומר..." : "שמירה"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setFormError("");
              }}
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">מקורות הכנסה</div>
        {income.length === 0 ? (
          <div className="exp-empty">עדיין אין הכנסות — לחצי + כדי להוסיף</div>
        ) : (
          <div className="income-list">
            {income.map((inc) => (
              <div key={inc.id} className="income-row">
                <div className="income-icon">💚</div>
                <div className="income-info">
                  <div className="income-source">{inc.source}</div>
                  <div className="income-date">{inc.date}</div>
                </div>
                <div className="income-right">
                  <div className="income-amount">+{fmt(inc.amount)}</div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(inc.id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
