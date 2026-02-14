// src/api/notificationApi.ts
import { AxiosInstance } from "axios";

// Fetch all notifications for the logged-in user
export const getNotifications = async (api: AxiosInstance) => {
  const { data } = await api.get<Notification[]>("/notifications");
  return data;
};

// Mark a notification as read
export const markNotificationRead = async (api: AxiosInstance, id: string) => {
  const { data } = await api.patch<Notification>(`/notifications/${id}/read`);
  return data;
};

// Delete a notification
export const deleteNotification = async (api: AxiosInstance, id: string) => {
  await api.delete(`/notifications/${id}`);
};