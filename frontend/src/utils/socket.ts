// src/hooks/useSocketNotifications.ts
import { io, Socket } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client"; // ✅ token-aware axios client
import { getNotifications } from "../api/notificationApi"; // ✅ use notificationApi

export interface Notification {
  id?: string;
  type: string;
  message?: string;
  task?: { id: string; title: string };
  taskId?: string;
  createdAt?: string;
}

export const socket: Socket = io(
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000",
  {
    withCredentials: true,
    transports: ["websocket"],
  }
);

export function useSocketNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    // ✅ Step 1: Fetch notifications from DB once on login
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(api); // use notificationApi
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();

    // ✅ Step 2: Ensure socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    // ✅ Step 3: Join the user-specific room
    socket.emit("user:join", user.id);

    // ✅ Step 4: Handle incoming real-time notifications
    const handler = (payload: Notification) => {
      console.log("Notification received:", payload);

      setNotifications((prev) => {
        const exists = prev.some(
          (n) =>
            (payload.id && n.id === payload.id) ||
            (n.type === payload.type && n.message === payload.message)
        );
        return exists ? prev : [...prev, payload];
      });

      if (
        payload.type === "TASK_ASSIGNED" ||
        payload.type === "TASK_CREATED" ||
        payload.type === "TASK_UPDATED" ||
        payload.type === "TASK_DELETED"
      ) {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      }
    };

    socket.on("notify", handler);

    return () => {
      socket.off("notify", handler);
      socket.emit("user:leave", user.id);
    };
  }, [user, queryClient]);

  const clearNotifications = () => setNotifications([]);

  return { notifications, clearNotifications, socket };
}