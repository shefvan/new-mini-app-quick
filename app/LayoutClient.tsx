"use client";

import { usePathname } from "next/navigation";
import AppHeader from "@/app/components/AppHeader";
import BottomNav from "@/app/components/BottomNav";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname === "/loading";

  return (
    <div className="app-wrapper flex flex-col min-h-screen">
      {!hideLayout && <AppHeader />}

      <div className="page-content flex-1">
        {children}
      </div>

      {!hideLayout && <BottomNav />}
    </div>
  );
}