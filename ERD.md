# ERD — TrackIt Expense App

## דיאגרמת ישויות וקשרים

```mermaid
erDiagram
  AUTH_USERS {
    uuid id PK
    text email
    timestamp created_at
  }
  EXPENSE {
    uuid id PK
    uuid user_id FK
    numeric amount
    text merchant
    text category
    text type
    text payment
    date date
    text description
    text note
    text notes
    timestamp created_at
  }
  INCOME {
    uuid id PK
    uuid user_id FK
    numeric amount
    text source
    date date
    text description
    text note
    timestamp created_at
  }
  CATEGORY {
    uuid id PK
    uuid user_id FK
    text name
    text icon
    numeric budget
    timestamp created_at
  }

  AUTH_USERS ||--o{ EXPENSE   : "מבצע"
  AUTH_USERS ||--o{ INCOME    : "מקבל"
  AUTH_USERS ||--o{ CATEGORY  : "מגדיר"
```

## טבלאות

| טבלה       | Schema | תיאור                                      |
| ---------- | ------ | ------------------------------------------ |
| auth.users | auth   | משתמש — מנוהל ע"י Supabase Auth            |
| expenses   | public | הוצאה — סכום, קטגוריה, תאריך, אמצעי תשלום  |
| income     | public | הכנסה — מקור, סכום, תאריך                  |
| categories | public | קטגוריה — שם, אייקון, יעד תקציבי           |

## קשרים

- משתמש אחד → הוצאות רבות (One-to-Many)
- משתמש אחד → הכנסות רבות (One-to-Many)
- משתמש אחד → קטגוריות רבות (One-to-Many)

## הערות מימוש

- Auth מנוהל ע"י Supabase Auth (`auth.users`) — אין טבלת משתמשים ב-public schema
- כל טבלה מוגנת עם Row Level Security (RLS) — משתמש רואה רק את הנתונים שלו
- ה-FK של `user_id` מצביע ל-`auth.users.id`
- הנתונים נשמרים ב-PostgreSQL דרך Supabase
