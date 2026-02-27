/**
 * API Services Index
 * 
 * Central export file for all API service modules.
 * Import services from here for cleaner imports throughout the app.
 * 
 * Usage:
 * import { authService, subscriptionService, mosqueApi } from './services';
 */

export { authService } from "./auth";
export { subscriptionService } from "./subscriptions";
export { mosqueApi } from "./mosque";

// For React components, you can also import the useAxios hook directly:
// import { useAxios } from "../providers/AxiosProvider";

