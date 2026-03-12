import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json({ error: "No wallet" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("wallet", wallet.toLowerCase())  // 🔥 FIX
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}