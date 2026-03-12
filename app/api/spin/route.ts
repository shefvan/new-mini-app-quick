import { supabase } from "@/lib/supabase";
import { builders } from "@/lib/builders";
import { NextResponse } from "next/server";

/* ================= FOLLOWER → POINT LOGIC ================= */
function calculatePoints(followers: number) {
  if (!followers) return 5;

  if (followers < 500) return 1;
  if (followers < 2000) return 3;
  if (followers < 10000) return 5;
  if (followers < 30000) return 6;

  return 13; // 🔥 MAX CAP
}

export async function POST(req: Request) {
  const { wallet } = await req.json();

  if (!wallet) {
    return NextResponse.json({ error: "No wallet" });
  }
/* ================= WEIGHTED RANDOM ================= */
function weightedRandom(users: any[]) {
  const weighted = users.map(user => {
    const followers = user.followers || 0;

    // 🔥 Followers koodiyaal weight kurayum
    const weight = 100000 / (followers + 1000);

    return { ...user, weight };
  });

  const totalWeight = weighted.reduce((sum, u) => sum + u.weight, 0);

  let random = Math.random() * totalWeight;

  for (const user of weighted) {
    if (random < user.weight) {
      return user;
    }
    random -= user.weight;
  }

  return weighted[0]; // fallback
}
  /* ================= GET USER ================= */
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("wallet", wallet)
    .single();

  if (!user || user.spins <= 0) {
    return NextResponse.json({ error: "No spins" });
  }

  /* ================= GET ACTIVE PAID ENTRIES ================= */
const { data: paidUsers } = await supabase
  .from("paid_entries")
  .select("*")
  .eq("is_active", true)
  .gt("expires_at", new Date().toISOString());

/* ================= GET ACTIVE FREE PREVIEW ================= */
const { data: freeUsers } = await supabase
  .from("free_preview")
  .select("*")
  .eq("is_active", true);

/* ================= COMBINE BUILDERS + PAID + FREE ================= */
const allCandidates = [
  ...builders,
  ...(paidUsers || []),
  ...(freeUsers || [])
];

  if (allCandidates.length === 0) {
    return NextResponse.json({ error: "No candidates" });
  }

  /* ================= SPIN ================= */
  const winner = weightedRandom(allCandidates);

  /* ================= CALCULATE REWARD ================= */
  const rewardPoints = calculatePoints(winner.followers || 0);

  const updatedSpins = user.spins - 1;
  const updatedTotalPoints = user.total_points + rewardPoints;

  /* ================= UPDATE USER ================= */
  await supabase
    .from("users")
    .update({
      spins: updatedSpins,
      total_points: updatedTotalPoints,
    })
    .eq("wallet", wallet);

  /* ================= RESPONSE ================= */
  return NextResponse.json({
    winner: {
      ...winner,
      points: rewardPoints,
    },
    spins: updatedSpins,
    total_points: updatedTotalPoints,
  });
}