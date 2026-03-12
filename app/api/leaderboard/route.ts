import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: players } = await supabase
    .from("users")
    .select("id, username, avatar, total_points, wallet")
    .order("total_points", { ascending: false });

  const { data: reward } = await supabase
    .from("reward_pool")
    .select("*")
    .single();

  return Response.json({
    players,
    rewardPool: reward?.amount || 0,
    maxAmount: reward?.max_amount || 5000,
    seasonName: reward?.season_name || "Season 1",
    seasonDescription:
      reward?.season_description || "Rewards Coming Soon 🎉",
  });
}