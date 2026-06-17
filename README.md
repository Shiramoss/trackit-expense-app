# TrackIt — אפליקציית מעקב הוצאות

פרויקט React לניהול הוצאות חודשיות.  
בנוי כחלק ממשימת מודול 6 — פיתוח Frontend.

---

## מבנה הפרויקט

```
trackit/
├── DESIGN.md               ← מערכת עיצוב מלאה
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            ← נקודת כניסה
    ├── App.jsx             ← Routing ראשי
    ├── styles/
    │   └── globals.css     ← CSS Variables + עיצוב גלובלי
    ├── data/
    │   └── dummyData.js    ← נתוני Placeholder
    ├── components/
    │   ├── Navbar/
    │   │   ├── Navbar.jsx
    │   │   └── Navbar.css
    │   ├── Footer/
    │   │   ├── Footer.jsx
    │   │   └── Footer.css
    │   └── Layout/
    │       └── Layout.jsx
    └── pages/
        ├── DashboardPage.jsx   /
        ├── ExpensesPage.jsx    /expenses
        ├── IncomePage.jsx      /income
        ├── BudgetPage.jsx      /budget
        ├── ReportsPage.jsx     /reports
        └── SettingsPage.jsx    /settings
```

---

## עמודים ו-URL

| עמוד              | URL        | רמת גישה |
|-------------------|------------|-----------|
| דשבורד            | `/`        | מחובר     |
| הוצאות            | `/expenses`| מחובר     |
| הכנסות            | `/income`  | מחובר     |
| תקציב             | `/budget`  | מחובר     |
| דוחות שנתיים      | `/reports` | מחובר     |
| הגדרות            | `/settings`| מחובר     |

---

## הרצת הפרויקט

```bash
# התקנת dependencies
npm install

# הרצה בסביבת פיתוח
npm run dev

# בנייה לייצור
npm run build
```

---

## טכנולוגיות

- **React 18** + **Vite 5**
- **React Router DOM v6** — ניווט בין עמודים
- **CSS Variables** — מערכת עיצוב מ-`globals.css`
- עיצוב **RTL עברי**, רספונסיבי לגודל מסך `375px` ומעלה

---

## מערכת עיצוב

כל הצבעים, הפונטים והמרווחים מוגדרים ב-`DESIGN.md`  
ומיושמים דרך CSS Variables ב-`src/styles/globals.css`.

לא קיים ערך hardcoded בקוד — הכל מגיע מהמשתנים.
