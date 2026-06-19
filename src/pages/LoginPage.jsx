// src/pages/LoginPage.jsx
import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./LoginPage.css";

export default function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!email || !password) {
      setError("נא למלא אימייל וסיסמה");
      return;
    }

    if (isRegister && !name.trim()) {
      setError("נא למלא שם");
      return;
    }

    if (password.length < 6) {
      setError("סיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });

        if (error) {
          setError(error.message);
          return;
        }

        const userData = {
          id: data.user?.id,
          email: data.user?.email || email,
          name: data.user?.user_metadata?.name || name,
        };

        localStorage.setItem("trackit_session", JSON.stringify(userData));
        onLogin(userData);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError("אימייל או סיסמה שגויים");
          return;
        }

        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
        };

        localStorage.setItem("trackit_session", JSON.stringify(userData));
        onLogin(userData);
      }
    } catch (err) {
      setError("משהו השתבש. נסי שוב.");
    } finally {
      setLoading(false);
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
              placeholder="לפחות 6 תווים"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            className="btn btn-primary login-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "טוען..." : isRegister ? "הרשמה" : "התחברות"}
          </button>
        </div>
      </div>
    </div>
  );
}
