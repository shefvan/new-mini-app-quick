"use client";

import {
  Heart,
  MessageCircle,
  Bookmark,
  Repeat2,
  UserPlus,
} from "lucide-react";

interface Props {
  task: any;
  onCheck: () => void;
}

export default function TaskCard({ task, onCheck }: Props) {

  const actionMap: any = {
  like: { title: "Like the post", icon: Heart },
  reply: { title: "Reply to the post", icon: MessageCircle },
  repost: { title: "Repost the post", icon: Repeat2 },
  recast: { title: "Recast the post", icon: Repeat2 },
  bookmark: { title: "Bookmark the post", icon: Bookmark },
  follow: { title: "Follow the account", icon: UserPlus },
};

  const platformName =
    task.platform === "twitter"
      ? "on X"
      : task.platform === "base"
      ? "on Base"
      : task.platform === "farcaster"
      ? "on Farcaster"
      : "";

  return (
    <div className="task-row">

      <div className="task-top">

        <div className="task-left">
          <div className="task-icon text-blue-600">
  {(() => {
    const Icon = actionMap[task.action_type]?.icon;
    return Icon ? <Icon size={20} strokeWidth={1.5} /> : null;
  })()}
</div>

          <h4 className="task-title">
            {actionMap[task.action_type]?.title} {platformName}
          </h4>
        </div>

        <div className="task-reward">
          +{task.reward || 1}
          <span>SPINS</span>
        </div>

      </div>

      <div className="task-actions-modern">
        <a
          href={task.url}
          target="_blank"
          rel="noopener noreferrer"
          className="open-btn-modern"
        >
          Open
        </a>

        <button
          className="check-btn-modern"
          onClick={onCheck}
        >
          ✓ Check
        </button>
      </div>

    </div>
  );
}