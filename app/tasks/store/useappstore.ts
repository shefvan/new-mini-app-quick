import { create } from "zustand";

type Task = {
  id: string;
  title: string;
  completed?: boolean;
};

type AppState = {
  wallet: string | null;
  chainId: number | null;
  status: "DISCONNECTED" | "CONNECTING" | "CONNECTED";
  points: number;
  tasks: Task[];
  error: string | null;
  connectedAt: number | null;

  connectStart: () => void;
  connectSuccess: (wallet: string, chainId: number) => void;
  disconnect: () => void;
  setTasks: (tasks: Task[]) => void;
  completeTask: (taskId: string, reward?: number) => void;
  setError: (error: string) => void;
  clearError: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  wallet: null,
  chainId: null,
  status: "DISCONNECTED",
  points: 0,
  tasks: [],
  error: null,
  connectedAt: null,

  connectStart: () =>
    set({ status: "CONNECTING", error: null }),

  connectSuccess: (wallet, chainId) =>
    set({
      wallet,
      chainId,
      status: "CONNECTED",
      connectedAt: Date.now(),
    }),

  disconnect: () =>
    set({
      wallet: null,
      chainId: null,
      status: "DISCONNECTED",
      points: 0,
      tasks: [],
      connectedAt: null,
    }),

  setTasks: (tasks) => set({ tasks }),

  completeTask: (taskId, reward = 50) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: true } : t
      ),
      points: state.points + reward,
    })),

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));