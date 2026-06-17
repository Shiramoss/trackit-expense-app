// src/data/dummyData.js

export const CATEGORIES = [
  { name: "סופר", budget: 1000, icon: "🛒" },
  { name: "רכב/דלק", budget: 800, icon: "🚗" },
  { name: "הזמנות ואוכל בחוץ", budget: 1000, icon: "🍽️" },
  { name: "ביטוחים", budget: null, icon: "🛡️" },
  { name: "מנויים", budget: null, icon: "📱" },
  { name: "קניות לבית", budget: null, icon: "🏠" },
  { name: "בגדים", budget: 1000, icon: "👗" },
  { name: "טיפוח", budget: 1000, icon: "💄" },
  { name: "חסכון", budget: null, icon: "💰" },
  { name: "לא רלוונטי", budget: null, icon: "📌" },
];

export const EXPENSES = [];

export const INCOME = [];

export const MONTHLY_SUMMARY = {
  month: "יוני 26",
  totalExpenses: 0,
  totalIncome: 0,
  balance: 0,
  fixed: 0,
  variable: 0,
  openingBalance: 0,
};

export const YEARLY_DATA = [
  { month: "ינואר 26", expenses: 0, income: 0, balance: 0 },
  { month: "פברואר 26", expenses: 0, income: 0, balance: 0 },
  { month: "מרץ 26", expenses: 0, income: 0, balance: 0 },
  { month: "אפריל 26", expenses: 0, income: 0, balance: 0 },
  { month: "מאי 26", expenses: 0, income: 0, balance: 0 },
  { month: "יוני 26", expenses: 0, income: 0, balance: 0 },
];
