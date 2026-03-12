import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {

  // 🔥 Paid active entries
  const { data: paid } = await supabase
    .from("paid_entries")
    .select("*")
    .eq("is_active", true)
    .gt("expires_at", new Date().toISOString());

  // 🔥 Free preview (admin added)
  const { data: free } = await supabase
    .from("free_preview")
    .select("*")
    .eq("is_active", true);

  return NextResponse.json([
    ...(paid || []),
    ...(free || [])
  ]);
}

