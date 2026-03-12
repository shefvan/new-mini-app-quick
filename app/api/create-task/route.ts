import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BUILDER_WALLET = "0xYOUR_WALLET_HERE";

export async function POST(req: Request) {
  const body = await req.json();
  const { wallet, platform, task_type, url, reward_spins } = body;

  if (wallet?.toLowerCase() !== BUILDER_WALLET.toLowerCase()) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { error } = await supabase.from("tasks").insert({
    created_by_wallet: wallet,
    platform,
    task_type,
    url,
    reward_spins,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ success: true });
}