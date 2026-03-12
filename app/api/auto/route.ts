import { addAutoPoints } from "@/lib/autoEngine";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = NextResponse.next();
  const session = await getIronSession<{ wallet?: string }>(
    req,
    res,
    sessionOptions
  );

  if (!session.wallet) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await addAutoPoints(session.wallet, 5);

  return NextResponse.json({ success: true });
}