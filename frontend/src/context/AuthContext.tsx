import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, logout as logoutApi, register as registerApi, getStoredUser } from "../api/authApi";
import { AuthResponse, User } from "../types/user";
import { api } from "../api/client";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem("accessToken"));

  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    const res: AuthResponse = await loginApi(email, password);
    setUser(res.user);
    setAccessToken(res.accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${res.accessToken}`;
  };

  const register = async (name: string, email: string, password: string) => {
    const res: AuthResponse = await registerApi(name, email, password);
    setUser(res.user);
    setAccessToken(res.accessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${res.accessToken}`;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};