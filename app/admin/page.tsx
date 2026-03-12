"use client";

import { useAccount } from "wagmi";
import { useState } from "react";
import { ADMIN_WALLETS } from "@/app/lib/admin";
import { TASKS } from "@/app/lib/tasks";

export default function AdminPage() {
  const { address } = useAccount();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [followers, setFollowers] = useState(0);
  const [status, setStatus] = useState("");

  // ❌ Not admin
  if (!address || !ADMIN_WALLETS.includes(address)) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Access denied</h2>
        <p>This page is for admin only.</p>
      </div>
    );
  }

  async function handleAddPreview() {
    setStatus("Adding...");

    const res = await fetch("/api/add-free-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: address,
        username,
        bio,
        image,
        followers: Number(followers),
      }),
    });

    const data = await res.json();

    if (data.error) {
      setStatus("Error: " + data.error);
    } else {
      setStatus("✅ Added successfully");
      setUsername("");
      setBio("");
      setImage("");
      setFollowers(0);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Grow Me – Admin Dashboard</h1>

      {/* Existing Tasks Section */}
      <h3 style={{ marginTop: 30 }}>Tasks</h3>
      {TASKS.map((task) => (
        <div
          key={task.id}
          style={{
            background: "#111",
            color: "#fff",
            padding: 16,
            borderRadius: 12,
            marginTop: 12,
          }}
        >
          <b>{task.title}</b>
          <p>{task.url}</p>
          <small>{task.points} point</small>
        </div>
      ))}

      {/* 🔥 NEW FREE PREVIEW SECTION */}
      <h3 style={{ marginTop: 40 }}>Add Free Preview Builder</h3>

      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="number"
          placeholder="Followers"
          value={followers}
          onChange={(e) => setFollowers(Number(e.target.value))}
        />
      </div>

      <button
        onClick={handleAddPreview}
        style={{
          marginTop: 15,
          padding: 10,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 8,
        }}
      >
        Add Builder
      </button>

      <p style={{ marginTop: 10 }}>{status}</p>
    </div>
  );
}