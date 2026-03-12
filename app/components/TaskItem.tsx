"use client";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { Task } from "@/app/lib/tasks";

export default function TaskItem({ task }: { task: Task }) {
  const [done, setDone] = useState(false);
  const [confirm, setConfirm] = useState(false);

  return (
    <>
      <div className="task-item">
        <div>
          <b>{task.title}</b>
          <small>+{task.points} point</small>
        </div>

        <div className="task-actions">
          <button onClick={() => window.open(task.url, "_blank")}>
            Open
          </button>
          <button disabled={done} onClick={() => setConfirm(true)}>
            {done ? "Completed" : "Check"}
          </button>
        </div>
      </div>

      {confirm && (
        <ConfirmModal
          onConfirm={() => {
            setDone(true);
            setConfirm(false);
          }}
          onClose={() => setConfirm(false)}
        />
      )}
    </>
  );
}