# ERD — TrackIt Expense App

## דיאגרמת ישויות וקשרים

```mermaid
erDiagram
  USER {
    uuid id PK
    text email
    text name
    text password
    timestamp created_at
  }
  EXPENSE {
    uuid id PK
    uuid user_id FK
    text merchant
    float amount
    text category
    text type
    text payment
    date date_raw
    text notes
    timestamp created_at
  }
  INCOME {
    uuid id PK
    uuid user_id FK
    text source
    float amount
    date date_raw
    timestamp created_at
  }
  CATEGORY {
    uuid id PK
    uuid user_id FK
    text name
    text icon
    int budget
  }
  SESSION {
    uuid id PK
    uuid user_id FK
    text token
    timestamp created_at
    timestamp expires_at
  }

  USER ||--o{ EXPENSE   : "מבצע"
  USER ||--o{ INCOME    : "מקבל"
  USER ||--o{ CATEGORY  : "מגדיר"
  USER ||--o{ SESSION   : "מחובר דרך"
```

## טבלאות

| טבלה     | תיאור                                     |
| -------- | ----------------------------------------- |
| USER     | משתמש — אימייל, שם, סיסמה, תאריך הצטרפות  |
| EXPENSE  | הוצאה — סכום, קטגוריה, תאריך, אמצעי תשלום |
| INCOME   | הכנסה — מקור, סכום, תאריך                 |
| CATEGORY | קטגוריה — שם, אייקון, יעד תקציבי          |
| SESSION  | session פעיל — token, תאריך יצירה ופקיעה  |

## קשרים

- משתמש אחד → הוצאות רבות (One-to-Many)
- משתמש אחד → הכנסות רבות (One-to-Many)
- משתמש אחד → קטגוריות רבות (One-to-Many)
- משתמש אחד → sessions רבים (One-to-Many)

## הערות מימוש

בגרסה הנוכחית הנתונים נשמרים ב-localStorage בדפדפן.
בגרסה הבאה יועברו ל-Supabase (PostgreSQL) עם אותו מודל נתונים.
