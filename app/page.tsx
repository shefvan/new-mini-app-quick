"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Based Tasks
        </h1>

        <p style={{ opacity: 0.85, margin: "12px 0 28px" }}>
          Earn crypto rewards for social actions on Farcaster
        </p>

        <ConnectWallet />
      </div>
    </div>
  );
}