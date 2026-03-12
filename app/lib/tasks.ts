export type Task = {
  id: string;
  title: string;
  platform: "x" | "base" | "farcaster";
  action: "follow" | "like" | "repost" | "comment";
  url: string;
  points: number;
};

export const TASKS: Task[] = [
  {
    id: "x-follow-keon",
    title: "Follow @KeonHD_X on X",
    platform: "x",
    action: "follow",
    url: "https://x.com/KeonHD_X",
    points: 1,
  },
  {
    id: "x-like-post",
    title: "Like the tweet on X",
    platform: "x",
    action: "like",
    url: "https://x.com/username/status/123",
    points: 1,
  },
];