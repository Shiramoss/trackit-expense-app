# DESIGN.md — TrackIt Expense App

## Overview
TrackIt is a Hebrew-first, RTL expense tracking app for individuals and couples.
Target users: young adults (20–35) managing monthly budgets in Israel.

---

## Color Palette

| Role        | Hex       | Usage                          |
|-------------|-----------|--------------------------------|
| Primary     | `#6366f1` | Buttons, links, active states  |
| Secondary   | `#8b5cf6` | Accents, gradients             |
| Accent      | `#f97316` | Expenses tab highlight         |
| Background  | `#f1f5f9` | Page background                |
| Surface     | `#ffffff` | Cards, modals                  |
| Text        | `#0f172a` | Primary text                   |
| Text Muted  | `#64748b` | Labels, captions               |
| Success     | `#059669` | Income, positive balance       |
| Danger      | `#dc2626` | Overspend, negative balance    |
| Warning     | `#d97706` | Near-budget alerts             |
| Border      | `#e2e8f0` | Card borders, dividers         |

### Per-Tab Colors
| Tab        | Color     |
|------------|-----------|
| Dashboard  | `#6366f1` |
| Expenses   | `#f97316` |
| Income     | `#22c55e` |
| Budget     | `#10b981` |
| Reports    | `#3b82f6` |
| Settings   | `#64748b` |

---

## Typography

| Role    | Font                          | Size / Weight         |
|---------|-------------------------------|-----------------------|
| Heading | Inter, system-ui              | 18–24px / 800         |
| Body    | Inter, system-ui              | 14px / 400            |
| Caption | Inter, system-ui              | 11–12px / 600         |
| Numbers | tabular-nums (font-variant)   | 14–22px / 700–900     |

---

## Spacing

| Token  | Value |
|--------|-------|
| sp-1   | 4px   |
| sp-2   | 8px   |
| sp-3   | 12px  |
| sp-4   | 16px  |
| sp-6   | 24px  |
| sp-8   | 32px  |

---

## Border Radius

| Token  | Value |
|--------|-------|
| r-sm   | 6px   |
| r-md   | 10px  |
| r-lg   | 14px  |
| r-xl   | 18px  |
| r-2xl  | 24px  |

---

## Component Styles

### Buttons
- Primary: `background: #6366f1`, white text, radius `r-lg`, padding `8px 16px`
- Secondary: transparent, border `1px solid #e2e8f0`, text `#0f172a`
- Danger: `background: #dc2626`, white text

### Cards
- Background: white, border `1px solid #e2e8f0`, radius `r-xl`
- Shadow: `0 1px 3px rgba(15,23,42,.06), 0 4px 8px rgba(15,23,42,.04)`
- Padding: `16px`

### Inputs
- Height: `40px`, border `1.5px solid #e2e8f0`, radius `r-lg`
- Focus: border `#6366f1`, shadow `0 0 0 3px rgba(99,102,241,.1)`

### Navigation (Pill Nav)
- Horizontal scrollable pill bar below topbar
- Active tab: gradient background matching tab color, white text
- Inactive: transparent, muted text

---

## Layout

- Direction: RTL (right-to-left, Hebrew)
- Max content width: `1100px`, centered
- Topbar: fixed, height `56px`
- Pill nav: sticky below topbar, height `52px`
- Content: scrollable, padding `16px`
- Responsive: mobile-first, breakpoint at `600px`
