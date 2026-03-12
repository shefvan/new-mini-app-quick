import { supabaseAdmin } from "./supabaseAdmin";

export async function addAutoPoints(wallet: string, points: number) {
  await supabaseAdmin.from("points_history").insert({
    wallet,
    source: "auto",
    points,
  });

  await supabaseAdmin.rpc("increment_points", {
    user_wallet: wallet,
    amount: points,
  });
}