/**
 * Authentication API Service
 * 
 * Handles all authentication-related API calls to the Django backend.
 * Uses axios directly instead of the useAxios hook (which must be used in React components).
 */

import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Create axios instance for auth requests
const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token and handle FormData
authAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY) || Cookies.get(ACCESS_TOKEN_KEY);
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
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401
authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || Cookies.get(REFRESH_TOKEN_KEY);

                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/api/auth/refresh_token/`, {
                        refresh: refreshToken
                    });

                    const { access } = response.data.tokens || response.data;

                    if (access) {
                        localStorage.setItem(ACCESS_TOKEN_KEY, access);
                        Cookies.set(ACCESS_TOKEN_KEY, access, { expires: 1 / 24, sameSite: "Lax" });
                        originalRequest.headers["Authorization"] = `Bearer ${access}`;
                        return authAxios(originalRequest);
                    }
                }

                // No refresh token, redirect to login
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                Cookies.remove(ACCESS_TOKEN_KEY);
                Cookies.remove(REFRESH_TOKEN_KEY);

                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            } catch (refreshError) {
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                Cookies.remove(ACCESS_TOKEN_KEY);
                Cookies.remove(REFRESH_TOKEN_KEY);

                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export const authService = {
    /**
     * Login user with credentials
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<{user: Object, tokens: Object}>}
     */
    login: async (email, password) => {
        const response = await authAxios.post("/api/auth/login/", { email, password });
        const { tokens, user } = response.data;

        // Store tokens
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
        Cookies.set(ACCESS_TOKEN_KEY, tokens.access, { expires: 1 / 24, sameSite: "Lax" });
        Cookies.set(REFRESH_TOKEN_KEY, tokens.refresh, { expires: 7, sameSite: "Lax" });

        return { user, tokens };
    },

    /**
     * Register new user
     * @param {Object} userData - { username, email, password, first_name, last_name, ... }
     * @returns {Promise<{user: Object, tokens: Object}>}
     */
    register: async (userData) => {
        const response = await authAxios.post("/api/auth/register/", userData);
        const { tokens, user } = response.data;

        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
        Cookies.set(ACCESS_TOKEN_KEY, tokens.access, { expires: 1 / 24, sameSite: "Lax" });
        Cookies.set(REFRESH_TOKEN_KEY, tokens.refresh, { expires: 7, sameSite: "Lax" });

        return { user, tokens };
    },

    /**
     * Logout user
     * @returns {Promise<void>}
     */
    logout: async () => {
        try {
            await authAxios.post("/api/auth/logout/");
        } finally {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            Cookies.remove(ACCESS_TOKEN_KEY);
            Cookies.remove(REFRESH_TOKEN_KEY);
        }
    },

    /**
     * Get current authenticated user
     * @returns {Promise<Object>}
     */
    getCurrentUser: async () => {
        const response = await authAxios.get("/api/auth/me/");
        return response.data;
    },

    /**
     * Refresh access token
     * @returns {Promise<{access: string, refresh?: string}>}
     */
    refreshToken: async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || Cookies.get(REFRESH_TOKEN_KEY);

        const response = await axios.post(`${API_URL}/api/auth/login/`, {
            refresh: refreshToken
        });

        const { access, refresh } = response.data.tokens || response.data;

        localStorage.setItem(ACCESS_TOKEN_KEY, access);
        if (refresh) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
        }
        Cookies.set(ACCESS_TOKEN_KEY, access, { expires: 1 / 24, sameSite: "Lax" });

        return { access, refresh };
    },

    /**
     * Change user password
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {Promise}
     */
    changePassword: async (oldPassword, newPassword) => {
        const response = await authAxios.post("/api/auth/change_password/", {
            old_password: oldPassword,
            new_password: newPassword
        });
        return response.data;
    },

    /**
     * Update user profile
     * @param {Object} profileData
     * @returns {Promise<Object>}
     */
    updateProfile: async (profileData) => {
        const response = await authAxios.patch("/api/auth/update_profile/", profileData);
        return response.data;
    },

    /**
     * Delete user account
     * @returns {Promise}
     */
    deleteAccount: async () => {
        const response = await authAxios.delete("/api/auth/delete_account/");
        return response.data;
    },

    /**
     * Check if user has valid token
     * @returns {boolean}
     */
    isAuthenticated: () => {
        if (typeof window === "undefined") return false;
        return !!(localStorage.getItem(ACCESS_TOKEN_KEY) || Cookies.get(ACCESS_TOKEN_KEY));
    }
};

export default authService;

