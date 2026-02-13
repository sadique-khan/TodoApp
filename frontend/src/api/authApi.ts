// src/api/authApi.ts
import { api } from "./client";
import { AuthResponse, User } from "../types/user";

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", { name, email, password });
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("user", JSON.stringify(data.user));
  return data;
};

export const getStoredUser = (): User | null => {
  const stored = localStorage.getItem("user");
  return (stored && stored !== "undefined") ? JSON.parse(stored) : null;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};