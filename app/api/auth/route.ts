import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  let body;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { wallet } = body || {};

  if (!wallet) {
    return NextResponse.json({ error: "No wallet" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("wallet", wallet)
    .single();

  if (existing) {
    return NextResponse.json(existing);
  }

  const { data, error } = await supabase
    .from("users")
    .insert([{ wallet }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}