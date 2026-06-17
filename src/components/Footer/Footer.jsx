// src/components/Footer/Footer.jsx
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo">
          <span className="footer-logo-icon">💳</span>
          <span className="footer-logo-text">TrackIt</span>
        </div>
        <p className="footer-tagline">מעקב הוצאות פשוט ומהיר</p>
        <p className="footer-copy">© 2026 TrackIt · כל הזכויות שמורות</p>
      </div>
    </footer>
  );
}
