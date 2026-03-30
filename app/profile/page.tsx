"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Session } from "next-auth";

interface ExtendedSession extends Session {
  token?: {
    username?: string;
    avatar?: string;
  };
}
type HistoryItem = {
  source: string;
  points: number;
};

export default function ProfilePage() {
  const { address, isConnected } = useAccount();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [referrals, setReferrals] = useState(0);
  const { data: session } = useSession();

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const inviteLink =
    typeof window !== "undefined" && address
      ? `${window.location.origin}/r/${address}`
      : "";

  useEffect(() => {
    if (!isConnected) return;

    // later backend fetch cheyyam
    setHistory([]);
    setReferrals(0);
  }, [isConnected]);

  if (!isConnected) {
    return (
      <div style={{ padding: 20 }}>
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <h3>🔐 Connect Wallet</h3>
          <p style={{ opacity: 0.6 }}>
            Please connect wallet to view profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px 100px 16px" }}>

      {/* Wallet Card */}
      <div
        style={{
          background: "#f3f4f6",
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <p style={{ opacity: 0.6 }}>Wallet</p>
        <h3 style={{ marginTop: 6 }}>
          Connected <span style={{ opacity: 0.6 }}>{shortAddress}</span>
        </h3>
      </div>

      {/* Social Card */}
      <div
        style={{
          background: "#f3f4f6",
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <p style={{ opacity: 0.6 }}>Social</p>

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>

          {/* Connect X */}
          {session ? (
  <button
    style={{
      flex: 1,
      padding: "12px",
      borderRadius: 14,
      background: "linear-gradient(135deg,#000,#1a1a1a)",
      color: "#fff",
      textAlign: "center",
      fontWeight: 600,
      border: "none",
      cursor: "not-allowed",
      boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
    }}
  >
    ✅ @{(session as ExtendedSession).token?.username}
  </button>
) : (
  <button
    onClick={() => signIn("twitter")}
    style={{
      flex: 1,
      padding: "12px",
      borderRadius: 14,
      background: "linear-gradient(135deg,#000,#1a1a1a)",
      color: "#fff",
      textAlign: "center",
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
    }}
  >
    Connect X
  </button>
)}
          {/* Connect Farcaster */}
          <a
            href="https://warpcast.com/~/settings/connected-accounts"
            target="_blank"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 14,
              background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
              color: "#fff",
              textAlign: "center",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            }}
          >
            Connect Farcaster
          </a>
        </div>
      </div>

      {/* Invite Card */}
      <div
        style={{
          background: "#f3f4f6",
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <p style={{ opacity: 0.6 }}>Invite Friends</p>

        <p style={{ marginTop: 6 }}>
          {referrals} referrals
        </p>

        <div
          style={{
            background: "#fff",
            padding: 12,
            borderRadius: 12,
            marginTop: 12,
            fontFamily: "monospace",
            fontSize: 14,
            overflowWrap: "break-word",
          }}
        >
          {inviteLink}
        </div>

        <button
          onClick={() => navigator.clipboard.writeText(inviteLink)}
          style={{
            marginTop: 14,
            width: "100%",
            padding: "12px",
            borderRadius: 14,
            background: "linear-gradient(135deg,#2563eb,#4f46e5)",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            fontSize: 15,
            boxShadow: "0 6px 20px rgba(37,99,235,0.3)",
            cursor: "pointer",
          }}
        >
          Copy
        </button>

        <p style={{ marginTop: 12, opacity: 0.6 }}>
          Share your link and earn 50% of your referrals&apos; points!
        </p>
      </div>

      {/* Points History */}
      <div
        style={{
          background: "#f3f4f6",
          borderRadius: 24,
          padding: 20,
        }}
      >
        <h3>Points History (last 10 spins)</h3>

        {history.length === 0 ? (
          <p style={{ opacity: 0.6, marginTop: 10 }}>
            No activity yet
          </p>
        ) : (
          history.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <span>{item.source}</span>
              <strong>+{item.points} Points</strong>
            </div>
          ))
        )}
      </div>

    </div>
  );
}