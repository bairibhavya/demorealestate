// src/services/dashboardService.js

import { supabase } from "./supabase";

export async function getDashboardStats() {
  const { count: totalProperties } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });

  const { count: featuredProperties } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("featured", true);

  const { count: soldProperties } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("status", "Sold");

  const { count: availableProperties } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("status", "Available");

  return {
    totalProperties,
    featuredProperties,
    soldProperties,
    availableProperties,
  };
}

export async function getRecentProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;

  return data;
}