"use client";

import { useAccount } from "wagmi";

export default function PremiumLockOverlay() {
  const { isConnected } = useAccount();

  if (isConnected) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backdropFilter: "blur(6px)",
        background: "rgba(255,255,255,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 28,
          borderRadius: 20,
          boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
          textAlign: "center",
          width: 280,
        }}
      >
        <div style={{ fontSize: 30 }}>🔒</div>
        <h3 style={{ marginTop: 10 }}>Connect Wallet</h3>
        <p style={{ fontSize: 13, opacity: 0.6 }}>
          Connect your wallet to access this feature.
        </p>

        <button
          style={{
            marginTop: 15,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 12,
            fontWeight: 600,
          }}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}