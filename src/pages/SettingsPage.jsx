// src/pages/SettingsPage.jsx
import { useState } from "react";
import { CATEGORIES } from "../data/dummyData";
import "./SettingsPage.css";

export default function SettingsPage() {
  const [user, setUser] = useState("shira");
  const [currency, setCurrency] = useState("₪");
  const [saved, setSaved] = useState(false);

  // קטגוריות — מתחילים מברירת המחדל, ניתן לשנות בדפדפן
  const [categories, setCategories] = useState(CATEGORIES);

  // שדות לטופס הוספת קטגוריה חדשה
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newBudget, setNewBudget] = useState("");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // הוספת קטגוריה חדשה
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

  // מחיקת קטגוריה
  const handleDeleteCategory = (name) => {
    setCategories((prev) => prev.filter((c) => c.name !== name));
  };

  // עדכון תקציב קטגוריה קיימת
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

      {/* פרופיל */}
      <div className="card">
        <div className="card-title">פרופיל</div>
        <div className="settings-section">
          <div className="field">
            <label className="field-label">משתמש פעיל</label>
            <select
              className="select"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            >
              <option value="shira">שירה</option>
              <option value="raz">רז</option>
            </select>
          </div>
          <div className="field">
            <label className="field-label">מטבע</label>
            <select
              className="select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="₪">₪ — שקל ישראלי</option>
              <option value="$">$ — דולר אמריקאי</option>
            </select>
          </div>
        </div>
      </div>

      {/* ניהול קטגוריות */}
      <div className="card">
        <div className="card-title">ניהול קטגוריות</div>

        {/* טופס הוספה */}
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

        {/* רשימת קטגוריות */}
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

        <p className="settings-note" style={{ marginTop: "12px" }}>
          ⚠️ שינויים בקטגוריות יאופסו בטעינה מחדש של הדף. בגרסה עם Backend הם
          יישמרו לצמיתות.
        </p>
      </div>

      {/* ניהול נתונים */}
      <div className="card">
        <div className="card-title">ניהול נתונים</div>
        <div className="settings-actions">
          <button className="btn btn-secondary">📥 ייצוא לאקסל</button>
          <button className="btn btn-secondary">💾 גיבוי נתונים</button>
          <button className="btn btn-danger">🗑 מחיקת כל הנתונים</button>
        </div>
        <p className="settings-note">
          ⚠️ מחיקת נתונים היא פעולה בלתי הפיכה. הקפד לגבות לפני.
        </p>
      </div>

      {/* שמירה */}
      <div className="settings-save">
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? "✓ נשמר!" : "שמירת הגדרות"}
        </button>
      </div>
    </div>
  );
}
