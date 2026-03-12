import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { wallet, username, bio, image, followers } = await req.json();

  if (!wallet) {
    return NextResponse.json({ error: "No wallet" });
  }

  // 🔐 Only treasury allowed
  const TREASURY = "0x68918b27ddf8567c9c0f8e1981f697fff7412f2c";

if (wallet.toLowerCase() !== TREASURY) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}


  const { error } = await supabase.from("free_preview").insert({
    username,
    bio,
    image,
    followers,
    is_active: true,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}