import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { wallet, spinCount } = await req.json();

  if (!wallet)
    return NextResponse.json({ error: "No wallet" }, { status: 400 });

  const { data } = await supabase
    .from("users")
    .select("spins")
    .eq("wallet", wallet)
    .single();

  if (!data)
    return NextResponse.json({ error: "User not found" }, { status: 400 });

  const updatedSpins = data.spins + spinCount;

  await supabase
    .from("users")
    .update({ spins: updatedSpins })
    .eq("wallet", wallet);

  return NextResponse.json({
    spins: updatedSpins,
  });
}