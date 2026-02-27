"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AxiosContext = createContext(null);

// Token keys - must match Django settings
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const AxiosProvider = ({ children }) => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
      withCredentials: true,
      // Don't set Content-Type here - let the browser set it automatically for FormData
      // The browser will add the proper multipart/form-data; boundary=xxx header
      headers: {
        "Content-Type": "application/json",
      },
    });

    return instance;
  }, []);

  useEffect(() => {
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error = null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve();
        }
      });
      failedQueue = [];
    };

    // Request interceptor - add JWT token
    axiosInstance.interceptors.request.use(
      (config) => {
        // Get token from localStorage (or cookies)
        let token = null;

        // Try localStorage first (for tokens stored there)
        if (typeof window !== "undefined") {
          token = localStorage.getItem(ACCESS_TOKEN_KEY);
        }

        // If not in localStorage, try cookies
        if (!token) {
          token = Cookies.get(ACCESS_TOKEN_KEY);
        }

        // Attach token to Authorization header
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        // If the request data is FormData, let the browser set the Content-Type
        // with the proper boundary parameter
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle 401 and token refresh
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          // If this is a login request, don't try to refresh
          if (originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register")) {
            return Promise.reject(error);
          }

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => axiosInstance(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            // Get refresh token from localStorage or cookies
            let refreshToken = null;

            if (typeof window !== "undefined") {
              refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
            }

            if (!refreshToken) {
              refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
            }

            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Call refresh endpoint
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh_token/`,
              { refresh: refreshToken },
              {
                headers: {
                  "Content-Type": "application/json"
                }
              }
            );

            // Update stored tokens
            const { access, refresh } = response.data.tokens || response.data;

            if (access) {
              if (typeof window !== "undefined") {
                localStorage.setItem(ACCESS_TOKEN_KEY, access);
              }
              Cookies.set(ACCESS_TOKEN_KEY, access, { expires: 1 / 24 }); // 1 hour
            }

            if (refresh) {
              if (typeof window !== "undefined") {
                localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
              }
              Cookies.set(REFRESH_TOKEN_KEY, refresh, { expires: 7 }); // 7 days
            }

            processQueue();

            // Retry original request with new token
            originalRequest.headers["Authorization"] = `Bearer ${access}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError);

            // If refresh fails - clear tokens and redirect to login
            if (typeof window !== "undefined") {
              localStorage.removeItem(ACCESS_TOKEN_KEY);
              localStorage.removeItem(REFRESH_TOKEN_KEY);
            }
            Cookies.remove(ACCESS_TOKEN_KEY);
            Cookies.remove(REFRESH_TOKEN_KEY);

            // Redirect to login
            if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosInstance]);

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxios = () => {
  const context = useContext(AxiosContext);

  if (!context) {
    throw new Error("useAxios must be used inside AxiosProvider");
  }

  return context;
};

// Export token keys for use in other modules
export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };

