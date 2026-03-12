"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useSwitchChain,
  useChainId,
} from "wagmi";
import { parseUnits } from "viem";
import { base } from "wagmi/chains";

const USDC_ADDRESS =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const TREASURY_ADDRESS =
  "0x68918b27ddf8567C9C0F8e1981F697fff7412F2C";

export default function AutoPage() {
  const { isConnected, address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();
  const chainId = useChainId();

  /* ---------------- HYDRATION FIX ---------------- */

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------------- STATE ---------------- */

  const [level, setLevel] = useState(1);
  const [started, setStarted] = useState(false);
  const [total, setTotal] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  /* ---------------- HEADER ---------------- */

  const Header = () => (
    <div style={{ textAlign: "center", marginTop: 30 }}>
      <p style={{ opacity: 0.5, letterSpacing: 2 }}>PASSIVE INCOME</p>
      <h1 style={{ marginTop: 6 }}>smart passive engine</h1>
      <p style={{ opacity: 0.7, marginTop: 6 }}>
        mining rewards on autopilot
      </p>
    </div>
  );

  /* ---------------- LOAD STORAGE ---------------- */

  useEffect(() => {
    if (!mounted || !address) return;

    const saved = localStorage.getItem("miner_" + address);
    if (!saved) return;

    const data = JSON.parse(saved);
    const now = Date.now();

    let updatedTotal = data.total;

    if (data.started && data.lastUpdate) {
      const seconds = (now - data.lastUpdate) / 1000;
      const ptsPerMin = data.level * 0.05;
      updatedTotal += (ptsPerMin / 60) * seconds;
    }

    setLevel(data.level);
    setStarted(data.started);
    setTotal(updatedTotal);
    setLastUpdate(now);
  }, [address, mounted]);

  /* ---------------- SAVE STORAGE ---------------- */

  useEffect(() => {
    if (!mounted || !address) return;

    localStorage.setItem(
      "miner_" + address,
      JSON.stringify({
        level,
        started,
        total,
        lastUpdate,
      })
    );
  }, [level, started, total, lastUpdate, address, mounted]);

  /* ---------------- LIVE MINING ---------------- */

  useEffect(() => {
    if (!mounted || !started || !lastUpdate) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const seconds = (now - lastUpdate) / 1000;

      const ptsPerMin = level * 0.05;
      const earned = (ptsPerMin / 60) * seconds;

      setTotal((prev) => prev + earned);
      setLastUpdate(now);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, level, lastUpdate, mounted]);

  /* ---------------- START ---------------- */

  function handleStart() {
    if (started) return;

    const now = Date.now();
    setStarted(true);
    setLastUpdate(now);
  }

  /* ---------------- REFRESH ---------------- */

  function handleRefresh() {
    if (!lastUpdate) return;

    const now = Date.now();
    const seconds = (now - lastUpdate) / 1000;

    const ptsPerMin = level * 0.05;
    const earned = (ptsPerMin / 60) * seconds;

    setTotal((prev) => prev + earned);
    setLastUpdate(now);
  }

  /* ---------------- UPGRADE ---------------- */

  async function upgradeLevel() {
    if (level >= 100 || upgrading) return;

    try {
      setUpgrading(true);

      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id });
      }

      const amount = parseUnits("1", 6);

      await writeContractAsync({
        address: USDC_ADDRESS,
        abi: [
          {
            name: "transfer",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "to", type: "address" },
              { name: "value", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
          },
        ],
        functionName: "transfer",
        args: [TREASURY_ADDRESS, amount],
        chainId: base.id,
      });

      setLevel((prev) => prev + 1);
      setLastUpdate(Date.now());
    } catch {
      console.log("Upgrade failed");
    }

    setUpgrading(false);
  }

  /* ---------------- HYDRATION GUARD ---------------- */

  if (!mounted) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  /* ---------------- LOCK ---------------- */

  if (!isConnected) {
    return (
      <div style={{ padding: "20px 16px 90px 16px" }}>
        <Header />
        <div
          style={{
            marginTop: 40,
            background: "#f3f4f6",
            borderRadius: 28,
            padding: 40,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 70 }}>⛏</div>
          <div style={{ opacity: 0.4, marginTop: 20 }}>
            Connect to Start Mining
          </div>
        </div>
      </div>
    );
  }

  const ptsPerMin = started ? level * 0.05 : 0;
  const ptsPerDay = started ? ptsPerMin * 60 * 24 : 0;

  return (
    <div style={{ padding: 20 }}>
      <Header />

      <div
        style={{
          marginTop: 20,
          background: "#fff",
          borderRadius: 20,
          padding: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>⛏ Points Miner</h3>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={{
                padding: "6px 14px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#f3f4f6",
                color: "#aaa",
                fontWeight: 600,
                cursor: "not-allowed",
              }}
            >
              AUTO
            </button>

            <button
              onClick={handleRefresh}
              style={{
                padding: "6px 14px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#fff",
                fontWeight: 600,
              }}
            >
              REFRESH
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          <div>
            <h2>Lv.{level}</h2>
            <p style={{ opacity: 0.6 }}>LEVEL</p>
          </div>

          <div>
            <h2>{ptsPerMin.toFixed(2)}</h2>
            <p style={{ opacity: 0.6 }}>PTS/MIN</p>
          </div>

          <div>
            <h2>{ptsPerDay.toFixed(0)}</h2>
            <p style={{ opacity: 0.6 }}>PTS/DAY</p>
          </div>

          <div>
            <h2>{total.toFixed(2)}</h2>
            <p style={{ opacity: 0.6 }}>TOTAL</p>
          </div>
        </div>

        {!started && (
          <div
            onClick={handleStart}
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 16,
              background: "linear-gradient(135deg,#2563eb,#4f46e5)",
              color: "#fff",
              textAlign: "center",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Start
          </div>
        )}

        {started && level < 100 && (
          <div
            onClick={upgradeLevel}
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 14,
              background: "#f3f4f6",
              textAlign: "center",
              cursor: upgrading ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {upgrading
              ? "Approving..."
              : `Upgrade to Lv.${level + 1} · ${
                  (level + 1) * 0.05 * 60 * 24
                } /day · $1`}
          </div>
        )}
      </div>
    </div>
  );
}