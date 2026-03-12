import type { Builder } from "./builders";

/* 
  candidates: builders + paid_entries + free_preview
  Each candidate can have:
  - weight (for static builders)
  - followers (for DB users)
*/

type Candidate = Builder & Partial<{ weight: number; followers: number }>;

export function spinBuilder(candidates: Candidate[]): Builder {
  if (!candidates || candidates.length === 0) {
    throw new Error("No candidates available");
  }

  const pool: Candidate[] = [];

  candidates.forEach((c) => {
    // 🔹 If static builder with weight
    if (c.weight) {
      for (let i = 0; i < c.weight; i++) {
        pool.push(c);
      }
    } 
    // 🔹 If DB user (paid/free) → weight based on followers
    else if (c.followers) {
      const weight = Math.min(Math.floor(c.followers / 1000) + 1, 20);
      for (let i = 0; i < weight; i++) {
        pool.push(c);
      }
    } 
    // 🔹 fallback
    else {
      pool.push(c);
    }
  });

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}