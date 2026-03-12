"use client";
import ConnectGateCard from "@/components/ConnectGateCard";
import { useState } from "react";
import "@/app/styles/tasks.css";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import ConfirmModal from "@/app/components/ConfirmModal";
import TaskCard from "@/app/components/TaskCard";


type Task = {
  reward: number;
  id: string;
  platform: string;
  action_type: string;
  url: string;
};



const TREASURY = "0x68918b27ddf8567C9C0F8e1981F697fff7412F2C".toLowerCase();
const actionMap: Record<string, { title: string; emoji: string }> = {
  like: { title: "Like the post", emoji: "❤️" },
  reply: { title: "Reply to the post", emoji: "💬" },
  repost: { title: "Repost the post", emoji: "🔁" },
  bookmark: { title: "Bookmark the post", emoji: "🔖" },
  recast: { title: "Recast the post", emoji: "🔁" },
};

type Platform = "twitter" | "base";
type TaskType = "post" | "follow";

export default function TasksPage() {
  const { address } = useAccount();
  const [tasks, setTasks] = useState<Task[]>([]);

  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const isTreasury =
  address && address.toLowerCase() === TREASURY;
  const [openPromote, setOpenPromote] = useState(false);
  const [openPaidEntry, setOpenPaidEntry] = useState(false);
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [taskType, setTaskType] = useState<TaskType>("post");
  const [taskUrl, setTaskUrl] = useState("");
  const [openFreeEntry, setOpenFreeEntry] = useState(false);
  const [freeUsername, setFreeUsername] = useState("");
  const [freeBio, setFreeBio] = useState("");
  const [freeImage, setFreeImage] = useState("");
  const [freeFollowers, setFreeFollowers] = useState("");
  const getPlaceholder = () => {
  
  if (platform === "twitter" && taskType === "post") {
    return "https://x.com/username/status/1234567890";
  }

  if (platform === "twitter" && taskType === "follow") {
    return "https://x.com/username";
  }

  if (platform === "base" && taskType === "post") {
    return "https://base.app/post/123456";
  }

  if (platform === "base" && taskType === "follow") {
    return "https://base.app/username";
  }

  return "";
};
 
  


useEffect(() => {
  async function loadTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  }

  loadTasks();
}, []);
// console.log("Loaded tasks:", tasks);

async function completeTask(taskId: string) {
  if (!address) return;

  const res = await fetch("/api/complete-task", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      wallet: address,
      taskId,
    }),
  });

  const data = await res.json();
  console.log(data);
  if (data.success) {
    window.dispatchEvent(new Event("spin-updated"));

  }
}

  

return (
    <div className="tasks-page">
      
      {/* HEADER */}
      <div className="tasks-header">
        <h1>Complete Tasks</h1>
        <p>Complete tasks to earn bonus points</p>
      </div>
      

{/* 🔒 LOCKED SECTION */}
    <ConnectGateCard>

      

      {/* PROMOTE CARD */}
<div
  className={'highlight-card blue'}
  onClick={() => setOpenPromote(true)}
>
  <div className="card-content">
    <span className="card-title">📣 Promote Your Content</span>
    <p className="card-sub">
      Add your task (like/comment/follow)to earn engagement
    </p>
  </div>
  <span className="arrow">›</span>
</div>

{/* ⭐ Paid Entry or Free Builder */}


<div
  className={`highlight-card ${
    address?.toLowerCase() === TREASURY ? "green" : "yellow"
  }`}
  onClick={() =>
    address?.toLowerCase() === TREASURY
      ? setOpenFreeEntry(true)
      : setOpenPaidEntry(true)
  }
>
  <div className="card-content">
    <span className="card-title">
      {address?.toLowerCase() === TREASURY
        ? "🆓 Add Free Builder"
        : "⭐ Paid Entry Request"}
    </span>
    <p className="card-sub">
      {address?.toLowerCase() === TREASURY
        ? "Treasury can add preview users without payment"
        : "Submit your profile to the roulette for 48 hours"}
    </p>
  </div>
  <span className="arrow">›</span>
</div>

{/* ================= REAL TASK LIST ================= */}

{tasks.length > 0 && (
  <div className="task-list">

    {Object.entries(
      tasks.reduce((acc: any, task) => {
        if (!acc[task.url]) acc[task.url] = [];
        acc[task.url].push(task);
        return acc;
      }, {})
    ).map(([url, groupedTasks]: any) => (

      <div className="task-group-card" key={url}>
        {groupedTasks.map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            onCheck={() => setSelectedTask(task)}
          />
        ))}
      </div>

    ))}

  </div>
)}


      {/* ================= MODAL ================= */}
      {openPromote && (
        <div className="modal-backdrop">
          <div className="modal">

            <div className="modal-header">
              <h2>Promote Your Content</h2>
              <button onClick={() => setOpenPromote(false)}>✕</button>
            </div>

            <p className="modal-desc">
              Submit your content to be promoted as a task.
              <br />
              <b>Task duration:</b> 24 hours.
              Payment of <b>10 USDC</b> required.
            </p>

            <div className="warning-box">
              ⚠ Token promotion is not allowed.
              Only content/profile promotion.
            </div>

            
    <div className="help-box">
  Having issues? Contact{" "}
  <a
    href="https://x.com/KeonHD_X"
    target="_blank"
    rel="noopener noreferrer"
    className="help-link"
  >
    @KeonHD_X
  </a>{" "}
  on X
</div>


        

            {/* PLATFORM */}
            <div className="section">
              <label>Platform</label>
              <div className="segmented">
                <button
                  className={`seg-btn ${platform === "twitter" ? "active" : ""}`}
                  onClick={() => setPlatform("twitter")}
                >
                  Twitter / X
                </button>
                <button
                  className={`seg-btn ${platform === "base" ? "active" : ""}`}
                  onClick={() => setPlatform("base")}
                >
                  Base App
                </button>
              </div>
            </div>

            {/* TASK TYPE */}
            <div className="section">
              <label>Task Type</label>
              <div className="segmented">
                <button
                  className={`seg-btn ${taskType === "post" ? "active" : ""}`}
                  onClick={() => setTaskType("post")}
                >
                  📝 Post
                </button>
                <button
                  className={`seg-btn ${taskType === "follow" ? "active" : ""}`}
                  onClick={() => setTaskType("follow")}
                >
                  👤 Follow
                </button>
              </div>
            </div>

            {/* INPUT */}
            <label className="input-label">Post URL *</label>
            <input
  className="text-input"
  placeholder={getPlaceholder()}
  value={taskUrl}
  onChange={(e) => setTaskUrl(e.target.value)}
/>

            {/* ACTIONS */}
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setOpenPromote(false)}
              >
                Cancel
              </button>

              <button
  className="btn-submit"
  onClick={async () => {
    if (!address) return alert("Connect wallet");

    if (isTreasury) {
      // 👑 ADMIN FREE CREATE
      await fetch("/api/admin/add-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: address,
          platform,
          type: taskType,
          url: taskUrl,
        }),
      });

      alert("Task created (Admin Free)");
      setOpenPromote(false);
      return;
    }

    // 👤 NORMAL USER → Pay 10 USDC logic call cheyyu
    alert("User must pay 10 USDC first");
  }}
>
  {isTreasury ? "Submit (Admin Free)" : "Pay $10 USDC & Submit"}
</button>
            </div>

          </div>
        </div>
      )}

  {/* ================= PAID ENTRY MODAL ================= */}
      {openPaidEntry && (
        <div className="modal-backdrop">
          <div className="modal">

            <div className="modal-header">
              <h2>⭐ Paid Entry Request</h2>
              <button onClick={() => setOpenPaidEntry(false)}>✕</button>
            </div>

            <p className="modal-desc">
              Submit your profile to be added to the roulette wheel for 48 hours.
              Payment of <b>10 USDC</b> required.
            </p>

            <div className="help-box">
              Having issues? Contact{" "}
              <a
                href="https://x.com/@KeonHD_X"
                target="_blank"
                rel="noopener noreferrer"
                className="help-link"
              >
                @KeonHD_X
              </a>{" "}
              on X
            </div>

            <label>Twitter/X Handle *</label>
            <input className="text-input" placeholder="@username" />
            <label>Bio (optional)</label>
            <textarea className="text-input" placeholder="Short bio..." />

            <label>Image URL (optional)</label>
            <input className="text-input" placeholder="https://unavatar.io/twitter/USERNAME" />

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setOpenPaidEntry(false)}
              >
                Cancel
              </button>

              <button className="btn-submit">
                 Pay ＄10 USDC & Submit
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ================= FREE BUILDER MODAL ================= */}

{openFreeEntry && (
  <div className="modal-backdrop">
    <div className="modal">

      <div className="modal-header">
        <h2>🆓 Add Free Builder</h2>
        <button onClick={() => setOpenFreeEntry(false)}>✕</button>
      </div>

      <label>Twitter/X Handle *</label>
      <input
        className="text-input"
        placeholder="@username"
        value={freeUsername}
        onChange={(e) => setFreeUsername(e.target.value)}
      />

      <label>Bio</label>
      <textarea
        className="text-input"
        placeholder="Short bio..."
        value={freeBio}
        onChange={(e) => setFreeBio(e.target.value)}
      />

      <label>Image URL</label>
      <input
        className="text-input"
        placeholder="https://image-url.com"
        value={freeImage}
        onChange={(e) => setFreeImage(e.target.value)}
      />

      <label>Followers</label>
      <input
        className="text-input"
        type="number"
        placeholder="Followers count"
        value={freeFollowers}
        onChange={(e) => setFreeFollowers(e.target.value)}
      />

      <div className="modal-actions">
        <button
          className="btn-cancel"
          onClick={() => setOpenFreeEntry(false)}
        >
          Cancel
        </button>

        <button
          className="btn-submit"
          onClick={async () => {
            if (!freeUsername) return alert("Username required");

            await fetch("/api/admin/add-free-builder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                wallet: address,
                username: freeUsername.replace("@", ""),
                bio: freeBio,
                image: freeImage,
                followers: Number(freeFollowers),
              }),
            });

            setOpenFreeEntry(false);
            setFreeUsername("");
            setFreeBio("");
            setFreeImage("");
            setFreeFollowers("");
          }}
        >
          Add Builder
        </button>
      </div>

    </div>
  </div>
)}
</ConnectGateCard>

{selectedTask && (
  <ConfirmModal
    onConfirm={() => {
      completeTask(selectedTask.id);
      setSelectedTask(null);
    }}
    onClose={() => setSelectedTask(null)}
  />
)}
    </div>
  );
  }
