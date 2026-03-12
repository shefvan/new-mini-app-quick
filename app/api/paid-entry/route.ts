import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { wallet, username, bio, image_url } = body;

  const { error } = await supabase.from("paid_entries").insert({
    wallet,
    username,
    bio,
    image_url,
    expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000)
  });

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ success: true });
}