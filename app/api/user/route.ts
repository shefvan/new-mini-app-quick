import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json({ error: "No wallet" }, { status: 400 });
  }

  const lowerWallet = wallet.toLowerCase();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("wallet", lowerWallet)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  // If the user doesn't exist, create a new one with default values
  if (!data) {
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        wallet: lowerWallet,
        spins: 0,
        total_points: 0,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(newUser);
  }

  return NextResponse.json(data);
}