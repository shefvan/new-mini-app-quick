import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { wallet, points } = await req.json();

  if (!wallet || points === undefined) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  // Update the user's mining points in the database
  const { error } = await supabase
    .from("users")
    .update({ mining_points: points })
    .eq("wallet", wallet.toLowerCase());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}