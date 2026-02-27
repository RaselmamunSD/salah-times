/**
 * Subscription API Service
 * 
 * Handles subscription/booking related API calls to the Django backend.
 * Uses axios directly for use in non-component contexts.
 */

import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const ACCESS_TOKEN_KEY = "access_token";

// Create axios instance
const subscriptionAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
subscriptionAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY) || Cookies.get(ACCESS_TOKEN_KEY);
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
subscriptionAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 globally
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export const subscriptionService = {
    /**
     * Create a new subscription
     * @param {Object} subscriptionData - { email, phone, subscription_type, ... }
     * @returns {Promise}
     */
    create: async (subscriptionData) => {
        const response = await subscriptionAxios.post("/api/subscribe/", subscriptionData);
        return response.data;
    },

    /**
     * Get all subscriptions (admin) or user's subscriptions
     * @param {Object} params - Query parameters
     * @returns {Promise}
     */
    list: async (params = {}) => {
        const response = await subscriptionAxios.get("/api/subscribe/", { params });
        return response.data;
    },

    /**
     * Get subscription by ID
     * @param {number} id - Subscription ID
     * @returns {Promise}
     */
    get: async (id) => {
        const response = await subscriptionAxios.get(`/api/subscribe/${id}/`);
        return response.data;
    },

    /**
     * Update subscription
     * @param {number} id - Subscription ID
     * @param {Object} data - Updated data
     * @returns {Promise}
     */
    update: async (id, data) => {
        const response = await subscriptionAxios.put(`/api/subscribe/${id}/`, data);
        return response.data;
    },

    /**
     * Delete/Unsubscribe
     * @param {number} id - Subscription ID
     * @returns {Promise}
     */
    delete: async (id) => {
        const response = await subscriptionAxios.delete(`/api/subscribe/${id}/`);
        return response.data;
    },

    /**
     * Activate subscription with token
     * @param {string} token - Activation token
     * @returns {Promise}
     */
    activate: async (token) => {
        const response = await subscriptionAxios.post("/api/subscribe/activate/", { token });
        return response.data;
    },

    /**
     * Unsubscribe using email
     * @param {string} email - Email address
     * @returns {Promise}
     */
    unsubscribe: async (email) => {
        const response = await subscriptionAxios.post("/api/subscribe/unsubscribe/", { email });
        return response.data;
    },

    /**
     * Get subscription logs
     * @param {Object} params - Query parameters
     * @returns {Promise}
     */
    getLogs: async (params = {}) => {
        const response = await subscriptionAxios.get("/api/subscribe/logs/", { params });
        return response.data;
    }
};

export default subscriptionService;

