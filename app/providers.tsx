"use client";

import type { ReactNode } from "react";
import { RootProvider } from "./rootProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return <RootProvider>{children}</RootProvider>;
}