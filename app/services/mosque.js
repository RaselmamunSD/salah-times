/**
 * Mosque API Service
 * 
 * Handles mosque-related API calls to the Django backend.
 * Includes bookings, donations, income/expense tracking.
 */

import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const ACCESS_TOKEN_KEY = "access_token";

// Create axios instance for authenticated requests
const mosqueAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Create axios instance for public endpoints (no auth)
const publicAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token
mosqueAxios.interceptors.request.use(
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
mosqueAxios.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

// ============================================
// BOOKING APIs
// ============================================

export const bookingService = {
    /**
     * Create a new booking
     * @param {Object} bookingData - { mosque, date, time, ... }
     * @returns {Promise}
     */
    create: async (bookingData) => {
        const response = await mosqueAxios.post("/api/mosques/bookings/", bookingData);
        return response.data;
    },

    /**
     * Get all bookings (filtered by user or mosque)
     * @param {Object} params - Query parameters (mosque_id, user_id, status)
     * @returns {Promise}
     */
    list: async (params = {}) => {
        const response = await mosqueAxios.get("/api/mosques/bookings/", { params });
        return response.data;
    },

    /**
     * Get booking by ID
     * @param {number} id - Booking ID
     * @returns {Promise}
     */
    get: async (id) => {
        const response = await mosqueAxios.get(`/api/mosques/bookings/${id}/`);
        return response.data;
    },

    /**
     * Update booking
     * @param {number} id - Booking ID
     * @param {Object} data - Updated data
     * @returns {Promise}
     */
    update: async (id, data) => {
        const response = await mosqueAxios.patch(`/api/mosques/bookings/${id}/`, data);
        return response.data;
    },

    /**
     * Cancel booking
     * @param {number} id - Booking ID
     * @returns {Promise}
     */
    cancel: async (id) => {
        const response = await mosqueAxios.post(`/api/mosques/bookings/${id}/cancel/`);
        return response.data;
    },

    /**
     * Delete booking (admin)
     * @param {number} id - Booking ID
     * @returns {Promise}
     */
    delete: async (id) => {
        const response = await mosqueAxios.delete(`/api/mosques/bookings/${id}/`);
        return response.data;
    },
};

// ============================================
// DONATION APIs
// ============================================

export const donationService = {
    /**
     * Create a new donation
     * @param {Object} donationData - { mosque, amount, donor_name, payment_method, ... }
     * @returns {Promise}
     */
    create: async (donationData) => {
        const response = await mosqueAxios.post("/api/mosques/donations/", donationData);
        return response.data;
    },

    /**
     * Get all donations
     * @param {Object} params - Query parameters
     * @returns {Promise}
     */
    list: async (params = {}) => {
        const response = await mosqueAxios.get("/api/mosques/donations/", { params });
        return response.data;
    },

    /**
     * Get donation by ID
     * @param {number} id - Donation ID
     * @returns {Promise}
     */
    get: async (id) => {
        const response = await mosqueAxios.get(`/api/mosques/donations/${id}/`);
        return response.data;
    },

    /**
     * Get donations for a specific mosque
     * @param {number} mosqueId - Mosque ID
     * @returns {Promise}
     */
    getByMosque: async (mosqueId) => {
        const response = await mosqueAxios.get(`/api/mosques/${mosqueId}/donations/`);
        return response.data;
    },

    /**
     * Get my donations
     * @returns {Promise}
     */
    getMyDonations: async () => {
        const response = await mosqueAxios.get("/api/mosques/donations/my/");
        return response.data;
    },
};

// ============================================
// INCOME APIs (Admin only)
// ============================================

export const incomeService = {
    /**
     * Create a new income entry
     * @param {Object} incomeData - { mosque, amount, source, description, date }
     * @returns {Promise}
     */
    create: async (incomeData) => {
        const response = await mosqueAxios.post("/api/mosques/income/", incomeData);
        return response.data;
    },

    /**
     * Get all income entries
     * @param {Object} params - Query parameters
     * @returns {Promise}
     */
    list: async (params = {}) => {
        const response = await mosqueAxios.get("/api/mosques/income/", { params });
        return response.data;
    },

    /**
     * Get income by ID
     * @param {number} id - Income ID
     * @returns {Promise}
     */
    get: async (id) => {
        const response = await mosqueAxios.get(`/api/mosques/income/${id}/`);
        return response.data;
    },

    /**
     * Update income entry
     * @param {number} id - Income ID
     * @param {Object} data - Updated data
     * @returns {Promise}
     */
    update: async (id, data) => {
        const response = await mosqueAxios.patch(`/api/mosques/income/${id}/`, data);
        return response.data;
    },

    /**
     * Delete income entry
     * @param {number} id - Income ID
     * @returns {Promise}
     */
    delete: async (id) => {
        const response = await mosqueAxios.delete(`/api/mosques/income/${id}/`);
        return response.data;
    },

    /**
     * Get income summary for a mosque
     * @param {number} mosqueId - Mosque ID
     * @returns {Promise}
     */
    getSummary: async (mosqueId) => {
        const response = await mosqueAxios.get(`/api/mosques/${mosqueId}/income/summary/`);
        return response.data;
    },
};

// ============================================
// EXPENSE APIs (Admin only)
// ============================================

export const expenseService = {
    /**
     * Create a new expense entry
     * @param {Object} expenseData - { mosque, amount, category, description, date }
     * @returns {Promise}
     */
    create: async (expenseData) => {
        const response = await mosqueAxios.post("/api/mosques/expenses/", expenseData);
        return response.data;
    },

    /**
     * Get all expense entries
     * @param {Object} params - Query parameters
     * @returns {Promise}
     */
    list: async (params = {}) => {
        const response = await mosqueAxios.get("/api/mosques/expenses/", { params });
        return response.data;
    },

    /**
     * Get expense by ID
     * @param {number} id - Expense ID
     * @returns {Promise}
     */
    get: async (id) => {
        const response = await mosqueAxios.get(`/api/mosques/expenses/${id}/`);
        return response.data;
    },

    /**
     * Update expense entry
     * @param {number} id - Expense ID
     * @param {Object} data - Updated data
     * @returns {Promise}
     */
    update: async (id, data) => {
        const response = await mosqueAxios.patch(`/api/mosques/expenses/${id}/`, data);
        return response.data;
    },

    /**
     * Delete expense entry
     * @param {number} id - Expense ID
     * @returns {Promise}
     */
    delete: async (id) => {
        const response = await mosqueAxios.delete(`/api/mosques/expenses/${id}/`);
        return response.data;
    },

    /**
     * Get expense summary for a mosque
     * @param {number} mosqueId - Mosque ID
     * @returns {Promise}
     */
    getSummary: async (mosqueId) => {
        const response = await mosqueAxios.get(`/api/mosques/${mosqueId}/expenses/summary/`);
        return response.data;
    },
};

// ============================================
// MOSQUE APIs
// ============================================

export const mosqueService = {
    /**
     * Get all mosques
     * @param {Object} params - Query parameters (location, search)
     * @returns {Promise}
     */
    list: async (params = {}) => {
        const response = await publicAxios.get("/api/mosques/", { params });
        return response.data;
    },

    /**
     * Get mosque by ID
     * @param {number} id - Mosque ID
     * @returns {Promise}
     */
    get: async (id) => {
        const response = await publicAxios.get(`/api/mosques/${id}/`);
        return response.data;
    },

    /**
     * Search mosques
     * @param {string} query - Search query
     * @returns {Promise}
     */
    search: async (query) => {
        const response = await publicAxios.get("/api/mosques/search/", { params: { q: query } });
        return response.data;
    },

    /**
     * Get mosques near a location
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {number} radius - Radius in km
     * @returns {Promise}
     */
    getNearby: async (lat, lng, radius = 10) => {
        const response = await publicAxios.get("/api/mosques/nearby/", {
            params: { latitude: lat, longitude: lng, radius }
        });
        return response.data;
    },

    /**
     * Add mosque to favorites
     * @param {number} mosqueId - Mosque ID
     * @returns {Promise}
     */
    addFavorite: async (mosqueId) => {
        const response = await mosqueAxios.post(`/api/mosques/${mosqueId}/favorite/`);
        return response.data;
    },

    /**
     * Remove mosque from favorites
     * @param {number} mosqueId - Mosque ID
     * @returns {Promise}
     */
    removeFavorite: async (mosqueId) => {
        const response = await mosqueAxios.delete(`/api/mosques/${mosqueId}/favorite/`);
        return response.data;
    },

    /**
     * Get user's favorite mosques
     * @returns {Promise}
     */
    getFavorites: async () => {
        const response = await mosqueAxios.get("/api/mosques/favorites/");
        return response.data;
    },

    /**
     * Get prayer times for a specific mosque
     * @param {number} mosqueId - Mosque ID
     * @returns {Promise}
     */
    getPrayerTimes: async (mosqueId) => {
        const response = await publicAxios.get(`/api/mosques/${mosqueId}/prayer_times/`);
        return response.data;
    },

    /**
     * Get mosque-specific monthly timetable
     * @param {number} mosqueId
     * @param {{month?: number, year?: number}} params
     * @returns {Promise}
     */
    getMonthlyTimetable: async (mosqueId, params = {}) => {
        const response = await publicAxios.get(`/api/mosques/${mosqueId}/monthly-timetable/`, { params });
        return response.data;
    },

    /**
     * Get Imam's own mosques
     * @returns {Promise}
     */
    getImamMosques: async () => {
        const response = await mosqueAxios.get("/api/mosques/imam/my-mosques/");
        return response.data;
    },

    /**
     * Create mosque as Imam
     * @param {Object} payload
     * @returns {Promise}
     */
    createImamMosque: async (payload) => {
        const response = await mosqueAxios.post("/api/mosques/imam/my-mosques/", payload);
        return response.data;
    },

    /**
     * Update mosque as Imam owner
     * @param {number} mosqueId
     * @param {Object} payload
     * @returns {Promise}
     */
    updateImamMosque: async (mosqueId, payload) => {
        const response = await mosqueAxios.patch(`/api/mosques/${mosqueId}/imam/manage/`, payload);
        return response.data;
    },

    /**
     * Delete mosque as Imam owner
     * @param {number} mosqueId
     * @returns {Promise}
     */
    deleteImamMosque: async (mosqueId) => {
        const response = await mosqueAxios.delete(`/api/mosques/${mosqueId}/imam/manage/`);
        return response.data;
    },

    /**
     * Save mosque monthly timetable in bulk
     * @param {number} mosqueId
     * @param {Object} payload
     * @returns {Promise}
     */
    saveImamMonthlyTimetable: async (mosqueId, payload) => {
        const response = await mosqueAxios.post(`/api/mosques/${mosqueId}/imam/monthly-timetable/`, payload);
        return response.data;
    },

    /**
     * Delete mosque monthly timetable entries
     * @param {number} mosqueId
     * @param {Object} payload - { year, month, days: [1, 2, 3] }
     * @returns {Promise}
     */
    deleteImamMonthlyTimetable: async (mosqueId, payload) => {
        const response = await mosqueAxios.delete(`/api/mosques/${mosqueId}/imam/monthly-timetable/`, { data: payload });
        return response.data;
    },

    /**
     * Submit mosque registration request (must NOT use auth token)
     * @param {Object} payload - Registration payload
     * @returns {Promise}
     */
    registerMosqueRequest: async (payload) => {
        const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
        const response = await publicAxios.post("/api/mosques/register/", payload, isFormData
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : undefined);
        return response.data;
    },
};

// ============================================
// PRAYER TIMES APIs
// ============================================

export const prayerTimeService = {
    /**
     * Get prayer times for a location
     * @param {Object} params - { location, date, month, year }
     * @returns {Promise}
     */
    get: async (params = {}) => {
        const response = await mosqueAxios.get("/api/prayer-times/", { params });
        return response.data;
    },

    /**
     * Get today's prayer times
     * @param {number} locationId - Location ID
     * @returns {Promise}
     */
    getToday: async (locationId) => {
        const response = await mosqueAxios.get(`/api/prayer-times/today/`, {
            params: { location: locationId }
        });
        return response.data;
    },

    /**
     * Get monthly prayer times
     * @param {number} locationId - Location ID
     * @param {number} month - Month number
     * @param {number} year - Year
     * @returns {Promise}
     */
    getMonthly: async (locationId, month, year) => {
        const response = await mosqueAxios.get(`/api/prayer-times/monthly/`, {
            params: { location: locationId, month, year }
        });
        return response.data;
    },
};

// ============================================
// EXPORT
// ============================================

export const mosqueApi = {
    booking: bookingService,
    donation: donationService,
    income: incomeService,
    expense: expenseService,
    mosque: mosqueService,
    prayerTime: prayerTimeService,
};

export default mosqueApi;
