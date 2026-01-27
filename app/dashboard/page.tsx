"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  reward: number;
  link: string;
};

export default function Dashboard() {
  const [points, setPoints] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [cooldown, setCooldown] = useState<Record<string, boolean>>({});

  const tasks: Task[] = [
    {
      id: "x",
      title: "follow keon on x",
      reward: 10,
      link: "https://x.com/KeonHD_X",
    },
    {
      id: "base",
      title: "follow keon on base",
      reward: 10,
      link: "https://base.app/profile/0x68918b27ddf8567C9C0F8e1981F697fff7412F2C",
    },
    {
      id: "farcaster",
      title: "follow keon on farcaster",
      reward: 10,
      link: "https://farcaster.xyz/shefvan",
    },
  ];

  // load saved data
  useEffect(() => {
    const p = localStorage.getItem("keon_points");
    const c = localStorage.getItem("keon_completed");

    if (p) setPoints(Number(p));
    if (c) setCompleted(JSON.parse(c));
  }, []);

  // save data
  useEffect(() => {
    localStorage.setItem("keon_points", points.toString());
    localStorage.setItem("keon_completed", JSON.stringify(completed));
  }, [points, completed]);

  function openTask(task: Task) {
    if (completed.includes(task.id)) return;

    window.open(task.link, "_blank");

    // disable verify for 15 seconds
    setCooldown((prev) => ({ ...prev, [task.id]: true }));

    setTimeout(() => {
      setCooldown((prev) => ({ ...prev, [task.id]: false }));
    }, 30000); // 3 sec delay
  }

  function verifyTask(task: Task) {
    if (completed.includes(task.id)) return;
    if (cooldown[task.id]) return;

    setPoints((prev) => prev + task.reward);
    setCompleted((prev) => [...prev, task.id]);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#ffffff",
        padding: "24px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "22px" }}>keon dashboard</h1>
      <p style={{ opacity: 0.7 }}>
        follow → wait → verify → earn points
      </p>

      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          borderRadius: "12px",
          background: "#151515",
        }}
      >
        <p style={{ opacity: 0.7 }}>your points</p>
        <h2 style={{ fontSize: "28px" }}>{points}</h2>
      </div>

      <div style={{ marginTop: "24px" }}>
        {tasks.map((task) => {
          const done = completed.includes(task.id);
          const waiting = cooldown[task.id];

          return (
            <div
              key={task.id}
              style={{
                background: "#121212",
                border: "1px solid #262626",
                borderRadius: "14px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <h3>{task.title}</h3>
              <p style={{ opacity: 0.6 }}>
                reward: +{task.reward} points
              </p>

              <div style={{ marginTop: "12px" }}>
                <button
                  onClick={() => openTask(task)}
                  disabled={done}
                  style={{
                    marginRight: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                  }}
                >
                  open
                </button>

                <button
                  onClick={() => verifyTask(task)}
                  disabled={done || waiting}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: done
                      ? "#2a2a2a"
                      : waiting
                      ? "#444"
                      : "#ffffff",
                    color:
                      done || waiting ? "#777" : "#000",
                    cursor:
                      done || waiting
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {done
                    ? "verified"
                    : waiting
                    ? "wait 15s"
                    : "verify"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: "30px", opacity: 0.6 }}>
        points will unlock future airdrops
      </p>
    </div>
  );
}