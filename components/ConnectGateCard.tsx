"use client";

import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useEffect, useState } from "react";

export default function ConnectGateCard({
  children,
  message,
}: {
  children: React.ReactNode;
  message?: string;
}) {
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return null; // prevent SSR mismatch
  }

  if (isConnected) return <>{children}</>;

  async function handleConnect() {
    await connectAsync({
      connector: injected(),
    });
  }

  return (
    <div
      style={{
        background: "#eef2ff",
        padding: 24,
        borderRadius: 20,
        marginTop: 20,
        textAlign: "center",
      }}
    >
      <h3>🔐 Connect Wallet</h3>
      <p>{message || "Connect your wallet to continue"}</p>

      <button
        onClick={handleConnect}
        style={{
          marginTop: 16,
          padding: "12px 22px",
          borderRadius: 14,
          background: "linear-gradient(135deg,#2563eb,#4f46e5)",
          color: "#fff",
          border: "none",
          fontWeight: 600,
        }}
      >
        Connect Wallet
      </button>
    </div>
  );
}