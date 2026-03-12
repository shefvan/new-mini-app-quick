"use client";

import ConnectGateCard from "@/components/ConnectGateCard";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import "./leaderboard.css";

interface Player {
  id: string;
  username: string;
  avatar: string;
  total_points: number;
  wallet: string;
}

export default function LeaderboardPage() {
  const { address } = useAccount();

  const [mounted, setMounted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rewardPool, setRewardPool] = useState(0);
  const [maxAmount, setMaxAmount] = useState(5000);
  const [seasonName, setSeasonName] = useState("");
  const [seasonDescription, setSeasonDescription] = useState("");
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myPoints, setMyPoints] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [address, mounted]);

  async function loadData() {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();

      const sorted = data.players || [];

      setPlayers(sorted);
      setRewardPool(data.rewardPool || 0);
      setMaxAmount(data.maxAmount || 5000);
      setSeasonName(data.seasonName || "");
      setSeasonDescription(data.seasonDescription || "");

      if (address) {
        const index = sorted.findIndex(
          (p: Player) =>
            p.wallet?.toLowerCase() === address.toLowerCase()
        );

        if (index !== -1) {
          setMyRank(index + 1);
          setMyPoints(sorted[index].total_points);
        }
      }
    } catch (err) {
      console.log("Leaderboard load failed");
    }
  }

  function renderRank(index: number) {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  }

  const progressPercent =
    rewardPool > 0
      ? Math.min((rewardPool / maxAmount) * 100, 100)
      : 0;

  if (!mounted) return null;

  return (
    <div className="lb-wrapper">
      <div className="lb-header">
        <p className="lb-small">LEADERBOARD</p>
        <h1>Top Growed Players</h1>
        <p className="lb-sub">
          See who’s growing the fastest
        </p>
      </div>

      <ConnectGateCard>
        <div className="lb-top-grid">

          {/* Top Players */}
          <div className="lb-card">
            <h3>Top Players</h3>
            <div className="avatar-row">
              {players.slice(0, 6).map((p) => (
                <img
                  key={p.id}
                  src={
                    p.avatar ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${p.username}`
                  }
                  className="top-avatar"
                />
              ))}
            </div>
          </div>

          {/* Reward Pool */}
          <div className="lb-card">
            <h3>USDC Reward Pool</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="reward-amount">
              {rewardPool} / {maxAmount} USDC
            </p>
          </div>
        </div>

        {/* Season */}
        <div className="season-box">
          <h4>{seasonName}</h4>
          <p>{seasonDescription}</p>
        </div>

        {/* Leaderboard List */}
        <div className="lb-list">
          {players.slice(0, 100).map((player, index) => (
            <div className="lb-item" key={player.id}>

              <div className="rank-circle">
                {renderRank(index)}
              </div>

              <div className="user-info">
                <img
                  src={
                    player.avatar ||
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${player.username}`
                  }
                  className="avatar"
                />
                <span>{player.username}</span>
              </div>

              <span className="points">
                {player.total_points} Points
              </span>

            </div>
          ))}
        </div>

        {/* My Position */}
        {myRank !== null && (
          <div className="my-position-box">
            <h4>Your Position</h4>
            <div className="lb-item">
              <div className="rank-circle">
                #{myRank}
              </div>
              <span>
                {address?.slice(0, 6)}...
              </span>
              <span>{myPoints} Points</span>
            </div>
          </div>
        )}

      </ConnectGateCard>
    </div>
  );
}