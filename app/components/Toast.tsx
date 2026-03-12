"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  message: string;
  type?: "success" | "info" | "error";
  onClose: () => void;
}

export default function Toast({
  message,
  type = "success",
  onClose,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="absolute top-2 left-0 right-0 px-4 z-50">
      <div
        className={`flex items-center justify-between rounded-2xl px-4 py-3 shadow-lg bg-white
        ${
          type === "success"
            ? "border-l-4 border-green-500"
            : type === "error"
            ? "border-l-4 border-red-500"
            : "border-l-4 border-blue-500"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100">
            {type === "success" ? "✔️" : type === "error" ? "❌" : "ℹ️"}
          </div>

          <p className="text-sm font-medium text-gray-800">
            {message}
          </p>
        </div>

        <button onClick={onClose} className="opacity-60">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}