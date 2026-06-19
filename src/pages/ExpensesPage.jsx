// src/pages/ExpensesPage.jsx
import { useState } from "react";
import "./ExpensesPage.css";

const fmt = (n) =>
  `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 0 })}`;

export default function ExpensesPage({
  expenses,
  categories,
  activeMonth,
  setActiveMonth,
  handleAddExpense,
  handleDeleteExpense,
}) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("הכל");
  const [typeFilter, setTypeFilter] = useState("הכל");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    merchant: "",
    amount: "",
    category: categories[0]?.name || "",
    date: "",
    type: "משתנה",
    payment: "ויזה",
    notes: "",
  });

  const cats = ["הכל", ...new Set(categories.map((c) => c.name))];

  const filtered = expenses.filter((e) => {
    const matchSearch =
      !search || e.merchant?.includes(search) || e.category?.includes(search);
    const matchCat = catFilter === "הכל" || e.category === catFilter;
    const matchType = typeFilter === "הכל" || e.type === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const handleAdd = async () => {
    setFormError("");

    if (!form.merchant.trim()) {
      setFormError("נא למלא שם עסק");
      return;
    }
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      setFormError("נא למלא סכום תקין וחיובי");
      return;
    }
    if (!form.category) {
      setFormError("נא לבחור קטגוריה");
      return;
    }

    // תאריך — אם לא נבחר, היום
    const dateStr = form.date || new Date().toISOString().split("T")[0];

    // עדכון החודש הפעיל לפי התאריך שנבחר
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
    await handleAddExpense({
      merchant: form.merchant.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      date: dateStr,
      type: form.type,
      payment: form.payment,
      notes: form.notes,
    });
    setSaving(false);

    setForm({
      merchant: "",
      amount: "",
      category: categories[0]?.name || "",
      date: "",
      type: "משתנה",
      payment: "ויזה",
      notes: "",
    });
    setFormError("");
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    await handleDeleteExpense(id);
  };

  return (
    <div className="expenses-page">
      <div className="exp-header">
        <div>
          <h1 className="exp-title">הוצאות</h1>
          <p className="exp-subtitle">
            {filtered.length} הוצאות · סה"כ {fmt(total)}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm((s) => !s);
            setFormError("");
          }}
        >
          {showForm ? "✕ ביטול" : "+ הוספת הוצאה"}
        </button>
      </div>

      {showForm && (
        <div className="card exp-form">
          <div className="card-title">הוצאה חדשה</div>
          <div className="exp-form-grid">
            <div className="field">
              <label className="field-label">שם עסק</label>
              <input
                className="input"
                placeholder="לדוגמה: שופרסל"
                value={form.merchant}
                onChange={(e) =>
                  setForm((p) => ({ ...p, merchant: e.target.value }))
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
              <label className="field-label">קטגוריה</label>
              <select
                className="select"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
              >
                {categories.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label">סוג</label>
              <select
                className="select"
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value }))
                }
              >
                <option>משתנה</option>
                <option>קבועה</option>
              </select>
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
            <div className="field">
              <label className="field-label">הערות</label>
              <input
                className="input"
                placeholder="אופציונלי"
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
              />
            </div>
          </div>
          {formError && (
            <div className="login-error" style={{ marginBottom: 10 }}>
              {formError}
            </div>
          )}
          <div className="exp-form-actions">
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

      <div className="card exp-filters">
        <input
          className="input exp-search"
          placeholder="חיפוש לפי שם עסק..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="exp-filter-row">
          <div className="exp-chips">
            {cats.map((c) => (
              <button
                key={c}
                className={`exp-chip ${catFilter === c ? "active" : ""}`}
                onClick={() => setCatFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            className="select exp-type-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option>הכל</option>
            <option>קבועה</option>
            <option>משתנה</option>
          </select>
        </div>
      </div>

      <div className="exp-list">
        {filtered.length === 0 && (
          <div className="exp-empty">
            {expenses.length === 0
              ? "עדיין אין הוצאות — לחצי + כדי להוסיף את הראשונה"
              : "לא נמצאו הוצאות תואמות לחיפוש"}
          </div>
        )}
        {filtered.map((exp) => {
          const catObj = categories.find((c) => c.name === exp.category);
          return (
            <div key={exp.id} className="expense-row">
              <div className="expense-icon">{catObj?.icon || "💳"}</div>
              <div className="expense-info">
                <div className="expense-merchant">{exp.merchant}</div>
                <div className="expense-meta">
                  {exp.date} ·{" "}
                  <span className="badge badge-accent">{exp.category}</span> ·{" "}
                  {exp.type}
                </div>
              </div>
              <div className="exp-row-right">
                <div className="expense-amount">-{fmt(exp.amount)}</div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(exp.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
