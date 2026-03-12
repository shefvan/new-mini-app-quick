import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { platform, url, wallet, isAdmin } = await req.json()

  if (!isAdmin) {
    // ഇവിടെ USDC check + deduct logic ഇടുക
  }

  const actions =
    platform === "twitter"
      ? ["like", "reply", "repost", "bookmark"]
      : ["like", "reply", "repost"]

  for (const action of actions) {
    await supabase.from("tasks").insert({
      platform,
      action_type: action,
      url,
      created_by: wallet,
    })
  }

  return NextResponse.json({ success: true })
}