import { supabase } from "./supabaseClient";

// 🔹 Get leaderboard players
export async function getLeaderboard() {
  const { data, error } = await supabase
    .from("users")
    .select("id, username, avatar, total_points")
    .eq("is_public", true)
    .order("total_points", { ascending: false });

  if (error) throw error;

  return data || [];
}

// 🔹 Get reward pool amount
export async function getRewardPool() {
  const { data, error } = await supabase
    .from("reward_pool")
    .select("usdc")
    .eq("id", 1)
    .single();

  if (error) {
    console.log("Reward pool empty");
    return 0;
  }

  return data?.usdc || 0;
}