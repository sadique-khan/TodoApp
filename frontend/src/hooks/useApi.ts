import { useAuth } from "../context/AuthContext";
import { api } from "../api/client"; // your axios instance
import { useEffect } from "react";
export const useApi = () => {
  const { accessToken } = useAuth();
  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;

        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup: eject interceptor when token changes or component unmounts
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [accessToken]);

  return api;
};