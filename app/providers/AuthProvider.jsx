"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAxios, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../providers/AxiosProvider";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const axios = useAxios();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // First effect: Mark as hydrated (runs only on client after mounting)
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Second effect: Check auth AFTER hydration
    useEffect(() => {
        if (!isHydrated) return;

        const checkAuth = async () => {
            try {
                // Get token from localStorage and Cookies (safe now - we're on client)
                let token = localStorage.getItem(ACCESS_TOKEN_KEY) || Cookies.get(ACCESS_TOKEN_KEY);

                console.log("[AuthProvider] Token found:", !!token);

                // If token exists, mark as authenticated immediately (optimistic)
                if (token) {
                    setIsAuthenticated(true);
                    console.log("[AuthProvider] Set isAuthenticated to true");

                    // Then verify token with API call
                    try {
                        const response = await axios.get("/api/auth/me/");
                        console.log("[AuthProvider] API verification successful:", response.data);
                        setUser(response.data);
                    } catch (error) {
                        console.log("[AuthProvider] API verification failed:", error.response?.status, error.message);

                        // Token is invalid, clear it
                        if (error.response?.status === 401) {
                            console.log("[AuthProvider] 401 Error - clearing tokens");
                            localStorage.removeItem(ACCESS_TOKEN_KEY);
                            localStorage.removeItem(REFRESH_TOKEN_KEY);
                            Cookies.remove(ACCESS_TOKEN_KEY);
                            Cookies.remove(REFRESH_TOKEN_KEY);
                            setIsAuthenticated(false);
                            setUser(null);
                        } else {
                            // Other errors - keep auth state but log error
                            console.error("[AuthProvider] Failed to fetch user:", error.message);
                        }
                    }
                } else {
                    // No token found - user is not logged in
                    console.log("[AuthProvider] No token found - logging out");
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("[AuthProvider] Unexpected error in checkAuth:", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [isHydrated, axios]);

    // Login function
    const login = useCallback(async (credentials) => {
        try {
            const response = await axios.post("/api/auth/login/", credentials);
            const { tokens, user: userData } = response.data;

            // Store tokens in localStorage
            localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
            localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);

            // Also set cookies for server-side access
            Cookies.set(ACCESS_TOKEN_KEY, tokens.access, {
                expires: 1 / 24, // 1 hour
                sameSite: "Lax"
            });
            Cookies.set(REFRESH_TOKEN_KEY, tokens.refresh, {
                expires: 7, // 7 days
                sameSite: "Lax"
            });

            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                error: error.response?.data?.detail || "Login failed. Please check your credentials."
            };
        }
    }, [axios]);

    // Register function
    const register = useCallback(async (userData) => {
        try {
            const response = await axios.post("/api/auth/register/", userData);
            const { tokens, user: newUser } = response.data;

            // Store tokens in localStorage
            localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
            localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);

            Cookies.set(ACCESS_TOKEN_KEY, tokens.access, {
                expires: 1 / 24,
                sameSite: "Lax"
            });
            Cookies.set(REFRESH_TOKEN_KEY, tokens.refresh, {
                expires: 7,
                sameSite: "Lax"
            });

            setUser(newUser);
            setIsAuthenticated(true);

            return { success: true, user: newUser };
        } catch (error) {
            console.error("Registration failed:", error);
            return {
                success: false,
                error: error.response?.data || "Registration failed. Please try again."
            };
        }
    }, [axios]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            // Call logout endpoint to notify backend
            await axios.post("/api/auth/logout/");
        } catch (error) {
            // Continue with logout even if API call fails
            console.error("Logout API error:", error);
        } finally {
            // Clear tokens from localStorage and cookies
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            Cookies.remove(ACCESS_TOKEN_KEY);
            Cookies.remove(REFRESH_TOKEN_KEY);

            setUser(null);
            setIsAuthenticated(false);

            // Redirect to login page
            window.location.href = "/login";
        }
    }, [axios]);

    // Update user profile
    const updateProfile = useCallback(async (data) => {
        try {
            const response = await axios.put("/api/auth/update_profile/", data);
            setUser(response.data);
            return { success: true, user: response.data };
        } catch (error) {
            console.error("Profile update failed:", error);
            return {
                success: false,
                error: error.response?.data || "Profile update failed."
            };
        }
    }, [axios]);

    // Change password
    const changePassword = useCallback(async (oldPassword, newPassword, newPasswordConfirm) => {
        try {
            await axios.post("/api/auth/change_password/", {
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirm: newPasswordConfirm
            });
            return { success: true };
        } catch (error) {
            console.error("Password change failed:", error);
            const apiError = error.response?.data;
            const normalizedError =
                apiError?.old_password ||
                apiError?.new_password ||
                apiError?.new_password_confirm ||
                apiError?.detail ||
                apiError;

            return {
                success: false,
                error: Array.isArray(normalizedError)
                    ? normalizedError[0]
                    : normalizedError || "Password change failed."
            };
        }
    }, [axios]);

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser: async () => {
            try {
                const response = await axios.get("/api/auth/me/");
                setUser(response.data);
                return response.data;
            } catch (error) {
                console.error("Failed to refresh user:", error);
                throw error;
            }
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};

export default AuthContext;

