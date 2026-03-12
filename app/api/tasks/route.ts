import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
  .from("tasks")
  .select("*")
  .eq("is_active", true)
  .gt("expires_at", new Date().toISOString()) // 🔥 expiry filter
  .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message });
  }

  return NextResponse.json(data || []);
}