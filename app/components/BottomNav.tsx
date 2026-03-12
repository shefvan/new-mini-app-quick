"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/app/styles/bottom-nav.css";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="bottom-nav">
      <NavBtn href="/spin" active={isActive("/spin")} icon=" Ϟ " label="Spin" />
      <NavBtn href="/tasks" active={isActive("/tasks")} icon="✓" label="Tasks" />
      <NavBtn href="/auto" active={isActive("/auto")} icon="⟳" label="Auto" />
      <NavBtn href="/leaderboard" active={isActive("/leaderboard")} icon="≣" label="Leaderboard" />
      <NavBtn href="/profile" active={isActive("/profile")} icon="◉" label="Profile" />
    </div>
  );
}

function NavBtn({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: string;
  label: string;
}) {
  return (
    <Link href={href} className="nav-btn">
      <div className={`nav-icon ${active ? "active" : ""}`}>
        {icon}
      </div>
      <span className={`nav-label ${active ? "active" : ""}`}>
        {label}
      </span>
    </Link>
  );
}     