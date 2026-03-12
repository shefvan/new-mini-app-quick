import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { wallet, platform, task_type, url } = body;

  // 🔥 Payment needs to be verified (TX hash check logic should be added later)

  const { error } = await supabase.from("promoted_tasks").insert({
    wallet,
    platform,
    task_type,
    url,
    paid_amount: 10,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ success: true });
}