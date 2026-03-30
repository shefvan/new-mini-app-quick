import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: players } = await supabase
    .from("users")
    .select("id, username, avatar, total_points, mining_points, wallet")
    .order("total_points", { ascending: false });

  // Combine total_points and mining_points for leaderboard ranking
  const combined = (players || [])
    .map((p) => ({
      ...p,
      combined_points: (p.total_points || 0) + (p.mining_points || 0),
    }))
    .sort((a, b) => b.combined_points - a.combined_points);

  const { data: reward } = await supabase
    .from("reward_pool")
    .select("*")
    .single();

  return Response.json({
    players: combined,
    rewardPool: reward?.amount || 0,
    maxAmount: reward?.max_amount || 5000,
    seasonName: reward?.season_name || "Season 1",
    seasonDescription: reward?.season_description || "Rewards Coming Soon 🎉",
  });
}