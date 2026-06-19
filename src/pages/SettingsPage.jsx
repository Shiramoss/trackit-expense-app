// src/pages/SettingsPage.jsx
import { useState } from "react";
import "./SettingsPage.css";

function exportToCSV(expenses) {
  const header = "תאריך,עסק,קטגוריה,סוג,תשלום,סכום,הערות";
  const rows = expenses.map((e) =>
    [e.date, e.merchant, e.category, e.type, e.payment, e.amount, e.notes || ""].join(",")
  );
  const csv = "﻿" + [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "trackit-expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function exportBackup(expenses, income, categories) {
  const data = {
    expenses,
    income,
    categories,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "trackit-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

export default function SettingsPage({
  categories,
  handleAddCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  user,
  handleLogout,
  allExpensesFlat,
  income,
  darkMode,
  setDarkMode,
}) {
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await handleAddCategory({
      name: newName.trim(),
      icon: newIcon.trim() || "📌",
      budget: newBudget ? parseInt(newBudget) : 0,
    });
    setSaving(false);
    setNewName("");
    setNewIcon("");
    setNewBudget("");
  };

  const handleDelete = async (id) => {
    await handleDeleteCategory(id);
  };

  const handleBudgetChange = async (cat, value) => {
    await handleUpdateCategory(cat.id, {
      budget: value === "" ? 0 : parseInt(value),
    });
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="exp-title">הגדרות</h1>
        <p className="exp-subtitle">ניהול חשבון והעדפות</p>
      </div>

      {/* פרטי חשבון */}
      <div className="card">
        <div className="card-title">חשבון</div>
        <div className="settings-section">
          <div className="settings-toggle-row">
            <div>
              <div className="settings-toggle-label">{user?.name}</div>
              <div className="settings-toggle-sub">{user?.email}</div>
            </div>
            <button className="btn btn-secondary" onClick={handleLogout}>
              יציאה
            </button>
          </div>
        </div>
      </div>

      {/* ניהול קטגוריות */}
      <div className="card">
        <div className="card-title">ניהול קטגוריות</div>
        <div className="cat-add-row">
          <input
            className="input"
            placeholder="שם קטגוריה..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <input
            className="input cat-icon-input"
            placeholder="😀"
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
          />
          <input
            className="input cat-budget-input"
            type="number"
            placeholder="תקציב ₪"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={saving}
          >
            {saving ? "..." : "+ הוסף"}
          </button>
        </div>

        <div className="cat-list">
          {categories.map((cat) => (
            <div key={cat.id || cat.name} className="cat-row">
              <span className="cat-row-icon">{cat.icon || "📌"}</span>
              <span className="cat-row-name">{cat.name}</span>
              <input
                className="input cat-budget-edit"
                type="number"
                placeholder="ללא תקציב"
                defaultValue={cat.budget || ""}
                onBlur={(e) => handleBudgetChange(cat, e.target.value)}
              />
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(cat.id)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* העדפות תצוגה */}
      <div className="card">
        <div className="card-title">העדפות תצוגה</div>
        <div className="settings-section">
          <div className="settings-toggle-row">
            <div>
              <div className="settings-toggle-label">מצב כהה</div>
              <div className="settings-toggle-sub">
                {darkMode ? "פעיל" : "כבוי"}
              </div>
            </div>
            <button
              className={`settings-toggle-pill ${darkMode ? "on" : ""}`}
              onClick={() => setDarkMode((d) => !d)}
            >
              {darkMode ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* ניהול נתונים */}
      <div className="card">
        <div className="card-title">ניהול נתונים</div>
        <div className="settings-actions">
          <button className="btn btn-secondary" onClick={() => exportToCSV(allExpensesFlat || [])}>📥 ייצוא לאקסל</button>
          <button
            className="btn btn-secondary"
            onClick={() => exportBackup(allExpensesFlat || [], income || [], categories)}
          >
            💾 גיבוי נתונים
          </button>
        </div>
        <p className="settings-note">
          ✅ הנתונים נשמרים בענן — מסונכרנים בכל מכשיר.
        </p>
      </div>
    </div>
  );
}
