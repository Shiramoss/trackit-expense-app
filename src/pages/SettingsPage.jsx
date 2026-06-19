// src/pages/SettingsPage.jsx
import { useState } from "react";
import "./SettingsPage.css";

export default function SettingsPage({
  categories,
  handleAddCategory,
  handleUpdateCategory,
  handleDeleteCategory,
  user,
  handleLogout,
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
          ✅ הנתונים נשמרים בענן — מסונכרנים בכל מכשיר.
        </p>
      </div>
    </div>
  );
}
