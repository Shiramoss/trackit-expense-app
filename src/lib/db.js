import { supabase } from "./supabase";

// ── EXPENSES ──────────────────────────────────────
export async function fetchExpenses() {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addExpense(expense) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) throw new Error("לא מחובר");
  const { data, error } = await supabase
    .from("expenses")
    .insert({ ...expense, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateExpense(id, updates) {
  const { data, error } = await supabase
    .from("expenses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExpense(id) {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
}

// ── INCOME ────────────────────────────────────────
export async function fetchIncome() {
  const { data, error } = await supabase
    .from("income")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function addIncome(item) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) throw new Error("לא מחובר");
  const { data, error } = await supabase
    .from("income")
    .insert({ ...item, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateIncome(id, updates) {
  const { data, error } = await supabase
    .from("income")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteIncome(id) {
  const { error } = await supabase.from("income").delete().eq("id", id);
  if (error) throw error;
}

// ── CATEGORIES ────────────────────────────────────
export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

export async function addCategory(category) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;
  if (!userId) throw new Error("לא מחובר");
  const { data, error } = await supabase
    .from("categories")
    .insert({ ...category, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}
