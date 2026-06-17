// src/pages/SettingsPage.jsx
import { useState } from "react";
import "./SettingsPage.css";

export default function SettingsPage({ categories, setCategories }) {
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddCategory = () => {
    if (!newName.trim()) return;
    setCategories((prev) => [
      ...prev,
      {
        name: newName.trim(),
        icon: newIcon.trim() || "📌",
        budget: newBudget ? parseInt(newBudget) : null,
      },
    ]);
    setNewName("");
    setNewIcon("");
    setNewBudget("");
  };

  const handleDeleteCategory = (name) => {
    setCategories((prev) => prev.filter((c) => c.name !== name));
  };

  const handleBudgetChange = (name, value) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.name === name
          ? { ...c, budget: value === "" ? null : parseInt(value) }
          : c,
      ),
    );
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="exp-title">הגדרות</h1>
        <p className="exp-subtitle">ניהול חשבון והעדפות</p>
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
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
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
          <button className="btn btn-primary" onClick={handleAddCategory}>
            + הוסף
          </button>
        </div>

        <div className="cat-list">
          {categories.map((cat) => (
            <div key={cat.name} className="cat-row">
              <span className="cat-row-icon">{cat.icon}</span>
              <span className="cat-row-name">{cat.name}</span>
              <input
                className="input cat-budget-edit"
                type="number"
                placeholder="ללא תקציב"
                value={cat.budget ?? ""}
                onChange={(e) => handleBudgetChange(cat.name, e.target.value)}
              />
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteCategory(cat.name)}
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
              <div className="settings-toggle-sub">בקרוב</div>
            </div>
            <div className="settings-toggle-pill disabled">OFF</div>
          </div>
        </div>
      </div>

      {/* ניהול נתונים */}
      <div className="card">
        <div className="card-title">ניהול נתונים</div>
        <div className="settings-actions">
          <button className="btn btn-secondary">📥 ייצוא לאקסל</button>
          <button className="btn btn-secondary">💾 גיבוי נתונים</button>
        </div>
        <p className="settings-note">
          ⚠️ הנתונים נשמרים בזיכרון הדפדפן בלבד — רענון הדף יאפס אותם.
        </p>
      </div>

      <div className="settings-save">
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? "✓ נשמר!" : "שמירת הגדרות"}
        </button>
      </div>
    </div>
  );
}
