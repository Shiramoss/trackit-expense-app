// src/components/Navbar/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const TABS = [
  { path: '/',          label: 'דשבורד',   icon: '📊', color: 'var(--c-dashboard)' },
  { path: '/expenses',  label: 'הוצאות',   icon: '💸', color: 'var(--c-expenses)'  },
  { path: '/income',    label: 'הכנסות',   icon: '💚', color: 'var(--c-income)'    },
  { path: '/budget',    label: 'תקציב',    icon: '🎯', color: 'var(--c-budget)'    },
  { path: '/reports',   label: 'דוחות',    icon: '📈', color: 'var(--c-reports)'   },
  { path: '/settings',  label: 'הגדרות',   icon: '⚙️', color: 'var(--c-settings)'  },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar-wrapper">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-icon">💳</div>
          <span>TrackIt</span>
        </div>
        <div className="topbar-spacer" />
        <div className="topbar-kpis">
          <div className="topbar-kpi">
            <span className="topbar-kpi-label">הוצאות חודש</span>
            <span className="topbar-kpi-value">₪0</span>
          </div>
          <div className="topbar-kpi">
            <span className="topbar-kpi-label">הכנסות</span>
            <span className="topbar-kpi-value">₪0</span>
          </div>
          <div className="topbar-kpi">
            <span className="topbar-kpi-label">יתרה</span>
            <span className="topbar-kpi-value">₪0</span>
          </div>
        </div>
      </div>

      {/* Pill Nav */}
      <nav className="pill-nav">
        <div className="pill-nav-inner">
          {TABS.map(tab => {
            const active = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`pill-tab ${active ? 'active' : ''}`}
                style={active ? { '--tab-color': tab.color } : {}}
              >
                <span className="pill-tab-icon">{tab.icon}</span>
                <span className="pill-tab-label">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
