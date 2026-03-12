import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, sessionOptions);

  if (!session.wallet) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user data
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("wallet", session.wallet)
    .single();

  // Get points history
  const { data: history } = await supabaseAdmin
    .from("points_history")
    .select("*")
    .eq("wallet", session.wallet)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({
    user,
    history,
  });
}