"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../providers/AuthProvider";

/**
 * ProtectedRoute component
 * Wraps protected content and redirects to login if not authenticated
 * 
 * @param {React.ReactNode} children - Child components to render
 * @param {string} redirectTo - Optional custom redirect path (default: /login)
 * @param {boolean} loadingScreen - Show loading screen while checking auth
 */
export const ProtectedRoute = ({
    children,
    redirectTo = "/login",
    loadingScreen = true
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        // Don't redirect while still loading
        if (loading) {
            return;
        }

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
            // Store the intended destination for redirecting back after login
            const returnUrl = pathname !== "/" ? pathname : "";
            const redirectUrl = returnUrl
                ? `${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`
                : redirectTo;

            router.push(redirectUrl);
        }
    }, [isAuthenticated, loading, pathname, router, redirectTo]);

    // Show loading screen while checking authentication
    if (loading && loadingScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/60">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render children if not authenticated
    if (!isAuthenticated && !loading) {
        return null;
    }

    return <>{children}</>;
};

/**
 * GuestRoute component
 * The opposite of ProtectedRoute - for pages that should only be 
 * accessible to unauthenticated users (like login/register)
 * 
 * @param {React.ReactNode} children - Child components to render
 * @param {string} redirectTo - Optional custom redirect path (default: /dashboard)
 */
export const GuestRoute = ({
    children,
    redirectTo = "/dashboard"
}) => {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (loading) {
            return;
        }

        // If authenticated, redirect to dashboard
        if (isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, loading, router, redirectTo]);

    // Show loading screen while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/60">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render children if authenticated (will redirect)
    if (isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

/**
 * Role-based access component
 * 
 * @param {React.ReactNode} children - Child components to render
 * @param {string[]} allowedRoles - Array of allowed role names
 * @param {string} redirectTo - Path to redirect if role not allowed
 */
export const RoleRoute = ({
    children,
    allowedRoles = [],
    redirectTo = "/unauthorized"
}) => {
    const router = useRouter();
    const { user, loading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        // Check if user has required role
        if (allowedRoles.length > 0 && user) {
            const userRole = user.role || user.user_type;
            if (!allowedRoles.includes(userRole)) {
                router.push(redirectTo);
            }
        }
    }, [user, loading, isAuthenticated, router, allowedRoles, redirectTo]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/60">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    // Additional role check for rendered content
    if (allowedRoles.length > 0 && user) {
        const userRole = user.role || user.user_type;
        if (!allowedRoles.includes(userRole)) {
            return null;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;

