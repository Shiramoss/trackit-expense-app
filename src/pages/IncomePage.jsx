// src/pages/IncomePage.jsx
import { useState } from 'react';
import { INCOME, MONTHLY_SUMMARY } from '../data/dummyData';
import './IncomePage.css';

const fmt = (n) => `₪${n.toLocaleString('he-IL')}`;

export default function IncomePage() {
  const [incomes, setIncomes] = useState(INCOME);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ source: '', amount: '', date: '' });

  const total = incomes.reduce((s, i) => s + i.amount, 0);

  const handleAdd = () => {
    if (!form.source || !form.amount) return;
    setIncomes(prev => [{ id: Date.now(), ...form, amount: parseFloat(form.amount) }, ...prev]);
    setForm({ source: '', amount: '', date: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => setIncomes(prev => prev.filter(i => i.id !== id));

  return (
    <div className="income-page">
      {/* Summary bar */}
      <div className="income-hero">
        <div className="income-hero-main">
          <div className="kpi-label">סך הכנסות — מאי 26</div>
          <div className="kpi-value amount-good">{fmt(total)}</div>
          <div className="income-hero-sub">{incomes.length} מקורות הכנסה</div>
        </div>
        <div className="income-hero-stats">
          <div className="income-stat">
            <span className="income-stat-label">הוצאות</span>
            <span className="income-stat-value amount-bad">{fmt(MONTHLY_SUMMARY.totalExpenses)}</span>
          </div>
          <div className="income-stat">
            <span className="income-stat-label">יתרה</span>
            <span className="income-stat-value amount-good">{fmt(MONTHLY_SUMMARY.balance)}</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕' : '+ הכנסה'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card income-form">
          <div className="card-title">הכנסה חדשה</div>
          <div className="income-form-grid">
            <div className="field">
              <label className="field-label">מקור</label>
              <input className="input" placeholder="לדוגמה: משכורת" value={form.source}
                onChange={e => setForm(p => ({ ...p, source: e.target.value }))} />
            </div>
            <div className="field">
              <label className="field-label">סכום (₪)</label>
              <input className="input" type="number" placeholder="0" value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
            </div>
            <div className="field">
              <label className="field-label">תאריך</label>
              <input className="input" type="date" value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={handleAdd}>שמירה</button>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>ביטול</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="card">
        <div className="card-title">מקורות הכנסה</div>
        <div className="income-list">
          {incomes.map(inc => (
            <div key={inc.id} className="income-row">
              <div className="income-icon">💚</div>
              <div className="income-info">
                <div className="income-source">{inc.source}</div>
                <div className="income-date">{inc.date}</div>
              </div>
              <div className="income-right">
                <div className="income-amount">+{fmt(inc.amount)}</div>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(inc.id)}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
