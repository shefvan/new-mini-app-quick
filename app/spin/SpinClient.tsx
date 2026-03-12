"use client";  
           
import ConnectGateCard from "@/components/ConnectGateCard";                
import { builders } from "@/lib/builders";                
import { useEffect, useState } from "react";                
import {                
  useAccount,                
  useBalance,                
  useWriteContract,            
  useSendTransaction                
}from "wagmi";                
import { base } from "wagmi/chains";                
import { parseUnits, parseEther} from "viem";                                
import "./spin.css";                               
import type { Builder } from "@/lib/builders";                

type PreviewUser = Builder & { bio?: string };
                
/* ================= CONSTANTS ================= */                
const USDC_BASE =                
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";                
                
const TREASURY_ADDRESS =                
  "0x68918b27ddf8567C9C0F8e1981F697fff7412F2C";                
                
const DAILY_SPINS = 10;                
const ONE_DAY = 24 * 60 * 60 * 1000;    


                
/* ================= ERC20 ABI ================= */                
const ERC20_ABI = [                
  {                
    type: "function",                
    name: "transfer",                
    stateMutability: "nonpayable",                
    inputs: [                
      { name: "to", type: "address" },                
      { name: "amount", type: "uint256" },                
    ],                
    outputs: [{ name: "", type: "bool" }],                
  },                
];                
                
export default function Page() {               
              
  const [mounted, setMounted] = useState(false);            
            
useEffect(() => {            
  setMounted(true);            
}, []);            
                  
  /* ================= WALLET ================= */                 
  const { address, isConnected } = useAccount();            
const wallet = address?.toLowerCase();              
                
  const { data: balanceData } = useBalance({                
    address,                
    chainId: base.id,                
    token: USDC_BASE,                
    query: { enabled: !!address },                
  });                
                
  const { writeContractAsync } = useWriteContract();             
  const { sendTransactionAsync } = useSendTransaction();               
                
  const _balanceText = balanceData                
    ? Number(balanceData.formatted).toFixed(2) + " USDC"                
    : "--";                
            

                
  /* ================= STATE ================= */                
  const [spins, setSpins] = useState(0);            
  const [autoSpin, setAutoSpin] = useState(false);                
  const [spinning, setSpinning] = useState(false);                
  const [winner, setWinner] = useState<Builder | null>(null);              
  const [_points, setPoints] = useState(0);                
  const [canCheckIn, setCanCheckIn] = useState(false);                
  const [buying, setBuying] = useState(false);                               
  const [showConfetti, setShowConfetti] = useState(false);                
  const [confettiItems, setConfettiItems] = useState<
    Array<{ left: string; color: string; delay: string }>
  >([]);                
  const [spinUsers, setSpinUsers] = useState<PreviewUser[]>([]);
  const [autoIndex, setAutoIndex] = useState(0);              
  const [timeLeft, setTimeLeft] = useState(0); 
  const TREASURY = "0x68918b27ddf8567C9C0F8e1981F697fff7412F2C".toLowerCase();

const _isTreasury =
  address?.toLowerCase() === TREASURY;

const allPreviewUsers: PreviewUser[] = [...builders, ...spinUsers];

const previewBuilder =
  allPreviewUsers.length > 0
    ? allPreviewUsers[autoIndex % allPreviewUsers.length]
    : null;

/* ================= LOAD SPIN CANDIDATES FOR PREVIEW ================= */

  useEffect(() => {
  async function loadSpinUsers() {
    const res = await fetch("/api/spin-candidates");
    const data = await res.json();

    if (Array.isArray(data)) {
      setSpinUsers(data);
      
    }
  }

  loadSpinUsers();
  
}, []);


useEffect(() => {
  console.log("Spins updated event fired");
}, []);
 
  
  /* ================= LOAD USER FROM BACKEND ================= */
useEffect(() => {
  if (!wallet) return;

  async function loadUser() {
    const res = await fetch(`/api/user?wallet=${wallet}`);
    const data = await res.json();

    if (!data || data.error) return;

    console.log("Loaded spins:", data.spins);

    setSpins(data.spins);
    setPoints(data.total_points);

    if (data.last_checkin) {
      const diff = Date.now() - data.last_checkin;
      const remaining = ONE_DAY - diff;

      if (remaining > 0) {
        setTimeLeft(remaining);
        setCanCheckIn(false);
      } else {
        setTimeLeft(0);
        setCanCheckIn(true);
      }
    } else {
      setCanCheckIn(true);
    }
  }

  loadUser();

window.addEventListener("spinsupdated", loadUser);

return () => {
  window.removeEventListener("spinsupdated", loadUser);
};

}, [wallet]);

/* ================= CHECK-IN COUNTDOWN TIMER ================= */

useEffect(() => {
  if (timeLeft <= 0) return;

  const interval = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1000) {
        clearInterval(interval);
        setCanCheckIn(true);
        return 0;
      }
      return prev - 1000;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [timeLeft]);
  
  
  /* ================= DAILY CHECK ================= */            
            
async function handleCheckIn() {            
  if (!wallet || !canCheckIn) return;            
            
  const res = await fetch("/api/checkin", {            
    method: "POST",            
    headers: { "Content-Type": "application/json" },            
    body: JSON.stringify({ wallet }),            
  });            
            
  const data = await res.json();            
            
  if (data.error) return;            
            
  setSpins(data.spins);            
  setCanCheckIn(false);  
  setTimeLeft(ONE_DAY);          
}            
  /* ================= spin ================= */                
  async function handleSpin() {            
  if (spins <= 0 || spinning || !wallet) return;            
            
  setSpinning(true);            
            
  setTimeout(async () => {            
            
    const res = await fetch("/api/spin", {            
      method: "POST",            
      headers: {            
        "Content-Type": "application/json",            
      },            
      body: JSON.stringify({ wallet }),            
    });            
            
    const data = await res.json();            
            
    if (data.error) {            
      console.log("Spin failed");            
      setSpinning(false);            
      return;            
    }            
            
    setWinner(data.winner);            
    setSpins(data.spins);            
    setPoints(data.total_points);            
            
    setSpinning(false);            
            
  }, 3000);            
}            
            
        

    
            
  /* ================= BUY SPINS (REAL USDC) ================= */                
  async function buySpinsUSDC(spinCount: number, price: string) {
  if (!isConnected || buying || !wallet) return;

  try {
    setBuying(true);

    const usdcAmount = parseUnits(price, 6);

    const usdcBalance = balanceData
      ? parseUnits(balanceData.formatted, 6)
      : 0n;

    // ===============================
    // 💰 PAY WITH USDC IF AVAILABLE
    // ===============================
    if (usdcBalance >= usdcAmount) {
      await writeContractAsync({
        address: USDC_BASE,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [TREASURY_ADDRESS, usdcAmount],
        chainId: base.id,
      });
    } else {
      // ===============================
      // 🔥 FALLBACK TO ETH
      // ===============================
      const ethEquivalent =
        price === "0.1" ? "0.00005" : "0.00015";

      await sendTransactionAsync({
        to: TREASURY_ADDRESS,
        value: parseEther(ethEquivalent),
        chainId: base.id,
      });
    }

    // ===============================
// ✅ UPDATE DB + GET NEW SPINS
// ===============================
const spinRes = await fetch("/api/buy-spins", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    wallet,
    spinCount,
  }),
});

const spinData = await spinRes.json();

if (!spinData.error) {
  setSpins(spinData.spins);
}

  } catch (err) {
    console.error("Payment failed", err);
  } finally {
    setBuying(false);
  }
}

     
  /* ================= WINNER CONFETTI ================= */                
useEffect(() => {                
  if (!winner) return;                
                
  const items = Array.from({ length: 40 }).map(() => ({                
    left: Math.random() * 100 + "%",                
    color: ["#22c55e","#3b82f6","#eab308","#ef4444"][                
      Math.floor(Math.random() * 4)                
    ],                
    delay: Math.random() * 0.3 + "s",                
  }));                
                
  setConfettiItems(items);                
  setShowConfetti(true);                
                
  const t = setTimeout(() => setShowConfetti(false), 3000);                
  return () => clearTimeout(t);                
}, [winner]);                
                
  /* ================= AUTO INDEX (ROTATING HIGHLIGHT) ================= */                
useEffect(() => {
  if (allPreviewUsers.length === 0) return;
  if (spinning || winner) return;

  const interval = setInterval(() => {
    setAutoIndex((prev) => prev + 1);
  }, 2500);

  return () => clearInterval(interval);
}, [allPreviewUsers.length, spinning, winner]);

console.log(                
  "autoIndex:",                
  autoIndex,                
  "preview:",                
  previewBuilder?.username                
);
                
  /* ================= AUTO SPIN ================= */                
  useEffect(() => {                
    if (!autoSpin || spinning) return;                
    if (spins <= 0) {                
      setAutoSpin(false);                
      return;                
    }                
      if (spinning)return;                
                
    const t = setTimeout(handleSpin, 1200);                
    return () => clearTimeout(t);                
  }, [autoSpin, spins, spinning]);                
                
  function format(ms:number) {                
  const h = Math.floor(ms / 3600000);                
  const m = Math.floor((ms % 3600000) / 60000);                
  const s = Math.floor((ms % 60000) / 1000);                
  return `${h}h ${m}m ${s}s`;                
}                
                
/* ================= PAUSE AUTO ON UNMOUNT ================= */                
useEffect(() => {                
  return () => {                
    setAutoSpin(false);                
  };                
}, []);                
            
if (!mounted) return null;            
                
  return (                
                    
  <div                
  style={{                
    padding:"0 16px 90px 16px",                
    position: "relative",                
    overflow: "hidden",                
  }}                
>                
      {/* ================= TOP ================= */}                
        {showConfetti && (                
  <div className="confetti-wrapper">                
    {confettiItems.map((item, i) => (                
      <div                
        key={i}                
        className="confetti"                
        style={{                
          left: item.left,                
          backgroundColor: item.color,                
          animationDelay: item.delay,                
        }}                
      />                
    ))}                
  </div>                
)}                
                      
                      
                
      {/* ================= MAIN ================= */}                
                      
        <main style={{padding:16}}></main>                
        <h2 style={{ textAlign: "center", marginBottom: 12 }}>                
  Do you want to grow?                
</h2>                
                
      <p style={{ textAlign: "center",fontSize: 13,  opacity: 0.6 }}>                
  Spinning through the most based builders on X                
</p>                
                
{!spinning && !winner && previewBuilder && (          
  <div                
    style={{                
      marginTop: 16,                
      background: "#fff",                
      borderRadius: 16,                
      padding: 20,                
      textAlign: "center",                
    }}                
  >                
    <div style={{ fontSize: 12, opacity: 0.6 }}>                
      previewing builders                
    </div>                
                
    <img                
      src={previewBuilder?.image}                
      alt={previewBuilder?.username}                
      className="preview-image"                
      style={{                
        width: 120,                
        height: 120,                
        borderRadius: 16,                
        objectFit: "cover",                
        marginTop: 10,                
        transition: "all 0.4s ease",                
      }}                
    />                
                
    <p style={{ marginTop: 8, fontWeight: 600 }}>                
  <a                
    href={`https://x.com/${previewBuilder?.username}`}                
    target="_blank"                
    rel="noopener noreferrer"                
    style={{ color: "#2563eb", textDecoration: "none" }}                
  >                
    @{previewBuilder?.username}                
  </a>                
</p>                
                
    <p style={{ fontSize: 12, opacity: 0.6 }}>                
      {previewBuilder?.role|| previewBuilder?.bio}                
    </p>                
  </div>                
)}              
                
        {/* ===== WINNER ===== */}                
        {winner && (                
  <div                
    className="winner"                
    style={{                
      background: "#fff",                
      borderRadius: 16,                
      padding: 20,                
      marginTop: 16,                
      textAlign: "center",                
    }}                
  >                
    <div style={{ fontSize: 12, opacity: 0.6 }}>                
      CONGRATULATIONS 🎉                
    </div>                
                
    <img                
      src={winner.image}                
      alt={winner.username}                
      className="spin-card"                
      style={{                
        width: 120,                
        height: 120,                
        borderRadius: 16,                
        objectFit: "cover",                
        marginTop: 10,                
      }}                
    />                
                
    {/* ✅ CLICKABLE USERNAME */}                
    <p style={{ marginTop: 10, fontWeight: 500 }}>                
  you are based as{" "}                
  <a                
    href={`https://x.com/${winner.username}`}                
    target="_blank"                
    rel="noopener noreferrer"                
    style={{                
      color: "#2563eb",                
      textDecoration: "none",                
      fontWeight: 600,                
    }}                
  >                
    @{winner.username}                
  </a>                
</p>                
                
    {/* ✅ POINTS EARNED */}                
    <div                
      style={{                
        marginTop: 8,                
        fontSize: 18,                
        fontWeight: 700,                
        color: "#16a34a",                
      }}                
    >                
      +{winner.points} points earned                
    </div>                
  </div>                
)}                
                
{/* 🔒 LOCKED SECTION */}                
    <ConnectGateCard>                
      <>                
        {/* ===== SPIN ===== */}                
        <button                
          onClick={handleSpin}                
          disabled={spins <= 0 || spinning}                
          style={{                
            marginTop: 20,                
            width: "100%",                
            padding: 14,                
            borderRadius: 14,                
            background:                
  spins > 0                
    ? "linear-gradient(135deg, #4f46e5, #6366f1)"                
    : "#aaa",                
boxShadow:                
  spins > 0                
    ? "0 8px 20px rgba(79,70,229,0.35)"                
    : "none",                
            color: "#fff",                
            border: "none",                
            fontWeight: 600,                
          }}                
        >                
          {spinning ? "Spinning..." : spins > 0 ? "Spin" : "No spins left"}                
        </button>                
                
        {/* ===== AUTO SPIN BAR ===== */}                
<div                
  style={{                
    marginTop: 10,                
    display: "flex",                
    alignItems: "center",                
    justifyContent: "space-between",                
    padding: "0 4px",                
  }}                
>                
  {/* AUTO SPIN SMALL BOX */}                
  <button                
  onClick={() => {                
    if (spins <= 0) return;   // only block if no spins                
    setAutoSpin((prev) => !prev);                
  }}                
  style={{                
    padding: "6px 10px",                
    borderRadius: 10,                
    border: "1px solid #e5e7eb",                
    background: autoSpin ? "#111827" : "#ffffff",                
    color: autoSpin ? "#ffffff" : "#111827",                
    fontWeight: 600,                
    fontSize: 12,                
    display: "flex",                
    alignItems: "center",                
    gap: 6,                
    cursor: spins > 0 ? "pointer" : "not-allowed",                
  }}                
>                
  <span                
    style={{                
      width: 10,                
      height: 10,                
      borderRadius: "50%",                
      background: autoSpin ? "#22c55e" : "#d1d5db",                
    }}                
  />                
  {autoSpin ? "Auto ON" : "Auto Spin"}                
</button>                
                
  {/* RIGHT SIDE SPINS COUNT */}                
  <span                
    style={{                
      fontSize: 12,                
      fontWeight: 600,                
      color: "#374151",                
    }}                
  >                
    {spins} spins                
  </span>                
</div>                
                
                    
                
    {/* ===== BUY SPINS ===== */}            
                    
        <div            
         style={{ background: "#fff", borderRadius: 16, padding: 20, marginTop: 20 }}>            
  <strong>🛒 Buy spins</strong>            
            
  <button            
    onClick={() => buySpinsUSDC(5, "0.1")}            
    disabled={buying}            
    style={{ marginTop: 12, width: "100%", padding: 14, borderRadius: 14, background: "#000", color: "#fff", border: "none", fontWeight: 600 }}            
              
  >            
    Buy 5 spins – 0.1 USDC            
  </button>            
            
  <button            
    onClick={() => buySpinsUSDC(10, "0.3")}            
    disabled={buying}            
    style={{ marginTop: 10, width: "100%", padding: 14, borderRadius: 14, background: "#000", color: "#fff", border: "none", fontWeight: 600 }}            
  >            
    Buy 10 spins – 0.3 USDC            
  </button>            
</div>            
            
        {/* ===== DAILY CHECK ===== */}                
<div                
  style={{                
    background: "#fff",                
    borderRadius: 16,                
    padding: 20,                
    marginTop: 20,                
  }}                
>                
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>                
    <div>                
      <strong>🔥 Daily reward</strong>                
      <p style={{ opacity: 0.7 }}>                
        Get {DAILY_SPINS} spins every 24h                
      </p>                
    </div>                
                
    <button                
      onClick={handleCheckIn}                
      disabled={!canCheckIn}                
      style={{                
        padding: "10px 18px",                
        borderRadius: 12,                
        border: "none",                
        background: canCheckIn ? "#1d4ed8" : "#aaa",                
        color: "#fff",                
        fontWeight: 600,                
      }}                
    >                
      {canCheckIn ? "Check in" : `Next in ${format(timeLeft)}`}                
    </button>                
  </div>                
</div>                
</>                
</ConnectGateCard>                
</div>               
);
}