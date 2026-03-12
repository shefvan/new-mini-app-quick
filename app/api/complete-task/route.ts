import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { wallet, taskId } = await req.json();

    if (!wallet || !taskId) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // 1️⃣ Already completed check
    const { data: existing, error: checkError } = await supabase
      .from("task_completions")
      .select("id")
      .eq("wallet", wallet)
      .eq("task_id", taskId)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json(
        { error: checkError.message },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json({ alreadyCompleted: true });
    }

    // 2️⃣ Insert completion
    const { error: insertError } = await supabase
      .from("task_completions")
      .insert({
        wallet,
        task_id: taskId,
      });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    // 3️⃣ Securely increment spins using RPC
    const { error: rpcError } = await supabase.rpc(
      "increment_spins",
      {
        user_wallet: wallet,
        amount: 1,
      }
    );

    if (rpcError) {
      return NextResponse.json(
        { error: rpcError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}