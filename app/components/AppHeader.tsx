"use client";

import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
} from "wagmi";
import { base } from "wagmi/chains";
import { useState, useRef, useEffect } from "react";

export default function AppHeader() {

  // 🔥 ALL HOOKS MUST BE AT TOP

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const { data } = useBalance({
    address,
    chainId: base.id,
    token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    query: { enabled: !!address },
  });



  useEffect(() => {
  if (!address) return;

  fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet: address }),
  });
}, [address]);

  // 🔥 Effects

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClick(e: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 🔥 AFTER ALL HOOKS — now safe
  if (!mounted) return null;

  const balanceText =
    data
      ? Number(data.formatted).toFixed(2) + " USDC"
      : "--";

  const avatar =
    "https://api.dicebear.com/7.x/identicon/svg?seed=" + address;

  return (
    <header
      style={{
        background: "#000",
        color: "#fff",
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img
          src="/WhatsApp Image 2026-02-06 at 6.06.06 PM.jpeg"
          alt="logo"
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            objectFit: "cover",
          }}
        />
        <strong style={{ fontSize: 16 }}>Grow Me</strong>
      </div>

      {/* RIGHT */}
      {!isConnected ? (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          style={{
            background: "linear-gradient(135deg,#111,#222)",
            color: "#fff",
            border: "1px solid #333",
            padding: "6px 14px",
            borderRadius: 10,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Connect wallet
        </button>
      ) : (
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
          ref={dropdownRef}
        >
          <div
            onClick={() => setOpen(!open)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#111",
              padding: "6px 10px",
              borderRadius: 12,
            }}
          >
            <span style={{ fontSize: 14 }}>{balanceText}</span>

            <img
              src={avatar}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
              }}
            />
          </div>

          {open && (
            <div
              style={{
                position: "absolute",
                top: 40,
                right: 0,
                background: "#111",
                border: "1px solid #333",
                borderRadius: 12,
                padding: 12,
                minWidth: 120,
              }}
            >
              <button
                onClick={() => disconnect()}
                style={{
                  background: "none",
                  border: "none",
                  color: "red",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}