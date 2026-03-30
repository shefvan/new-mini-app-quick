import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DAILY_SPINS = 10;
const ONE_DAY = 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const { wallet } = await req.json();

  if (!wallet)
    return NextResponse.json({ error: "No wallet" }, { status: 400 });

  const { data } = await supabase
    .from("users")
    .select("spins, last_checkin")
    .eq("wallet", wallet.toLowerCase())
    .single();

  if (!data)
    return NextResponse.json({ error: "User not found" }, { status: 400 });

  const now = Date.now();

  if (data.last_checkin && now - data.last_checkin < ONE_DAY) {
    return NextResponse.json({ error: "Already checked in" }, { status: 400 });
  }

  const updatedSpins = data.spins + DAILY_SPINS;

  await supabase
    .from("users")
    .update({
      spins: updatedSpins,
      last_checkin: now,
    })
    .eq("wallet", wallet.toLowerCase());

  return NextResponse.json({
    spins: updatedSpins,
    last_checkin: now,
  });
}