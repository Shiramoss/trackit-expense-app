// src/pages/LoginPage.jsx
import { useState } from "react";
import "./LoginPage.css";

export default function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email || !password) {
      setError("נא למלא אימייל וסיסמה");
      return;
    }
    if (isRegister && !name) {
      setError("נא למלא שם");
      return;
    }
    if (password.length < 4) {
      setError("סיסמה חייבת להכיל לפחות 4 תווים");
      return;
    }

    const users = JSON.parse(localStorage.getItem("trackit_users") || "{}");

    if (isRegister) {
      if (users[email]) {
        setError("משתמש כבר קיים עם האימייל הזה");
        return;
      }
      users[email] = { name, password };
      localStorage.setItem("trackit_users", JSON.stringify(users));
      localStorage.setItem("trackit_session", JSON.stringify({ email, name }));
      onLogin({ email, name });
    } else {
      const user = users[email];
      if (!user || user.password !== password) {
        setError("אימייל או סיסמה שגויים");
        return;
      }
      localStorage.setItem(
        "trackit_session",
        JSON.stringify({ email, name: user.name }),
      );
      onLogin({ email, name: user.name });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">💳</div>
          <h1 className="login-title">TrackIt</h1>
          <p className="login-sub">מעקב הוצאות פשוט ומהיר</p>
        </div>

        <div className="login-tabs">
          <button
            className={`login-tab ${!isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
          >
            התחברות
          </button>
          <button
            className={`login-tab ${isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
          >
            הרשמה
          </button>
        </div>

        <div className="login-form">
          {isRegister && (
            <div className="field">
              <label className="field-label">שם מלא</label>
              <input
                className="input"
                placeholder="שם מלא"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="field">
            <label className="field-label">אימייל</label>
            <input
              className="input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="field">
            <label className="field-label">סיסמה</label>
            <input
              className="input"
              type="password"
              placeholder="לפחות 4 תווים"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="btn btn-primary login-btn" onClick={handleSubmit}>
            {isRegister ? "הרשמה" : "התחברות"}
          </button>
        </div>
      </div>
    </div>
  );
}
