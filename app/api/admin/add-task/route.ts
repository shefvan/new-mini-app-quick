import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Platform = "twitter" | "base" | "farcaster";

const TREASURY = process.env.TREASURY_WALLET?.toLowerCase();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const wallet: string = body.wallet;
    const platform: Platform = body.platform;
    const url: string = body.url;

    if (!wallet || wallet.toLowerCase() !== TREASURY) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    const validPlatforms: Platform[] = [
      "twitter",
      "base",
      "farcaster",
    ];

    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform" },
        { status: 400 }
      );
    }

    let actions: string[] = [];

if (platform === "twitter") {
  actions = ["like", "reply", "repost", "bookmark"];
}

if (platform === "base") {
  actions = ["like", "reply", "repost"];
}

if (platform === "farcaster") {
  actions = ["like", "reply", "recast"];
}

    const expiryTime = new Date(
  Date.now() + 24 * 60 * 60 * 1000
).toISOString();

const tasksToInsert = actions.map((action) => ({
  platform,
  action_type: action,
  url,
  created_by: wallet,
  reward: 1,
  is_active: true,
  expires_at: expiryTime, // 🔥 24 hour expiry
}));

    const { data, error } = await supabase
      .from("tasks")
      .insert(tasksToInsert)
      .select();

    if (error) {
      console.log("INSERT ERROR:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}