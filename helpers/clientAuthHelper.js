'use client';

import { useSession } from "next-auth/react";

/**
 * Get the current user from the client side
 * @returns {Object|null} User data or null if not authenticated
 */
export function useCurrentUser() {
    const { data: session, status } = useSession();

    if (status !== 'authenticated' || !session?.user) {
        return null;
    }

    return {
        id: session.user.id,
        email: session.user.email,
        username: session.user.username,
        roles: session.user.roles || [],
        primaryRole: session.user.roles?.[0] || null,
        provider: session.user.provider
    };
}

/**
 * Check if the current user has a specific role (client-side)
 * @param {string|string[]} requiredRoles - Required role(s) to check for
 * @returns {boolean} True if user has the required role(s)
 */
export function useHasRole(requiredRoles) {
    const user = useCurrentUser();

    if (!user || !user.roles || user.roles.length === 0) {
        return false;
    }

    // Check if user has any of the required roles
    if (Array.isArray(requiredRoles)) {
        return requiredRoles.some(role => user.roles.includes(role));
    }

    // Check for a single required role
    return user.roles.includes(requiredRoles);
}

/**
 * Get the JWT token content directly (for advanced use cases)
 * Note: This is generally not recommended for most applications
 * as it requires manually accessing cookies
 * @returns {Object|null} The parsed JWT token or null
 */
export function getClientToken() {
    try {
        // Get the session token from cookies
        const cookies = document.cookie.split(';');
        const sessionCookie = cookies
            .find(cookie => cookie.trim().startsWith('next-auth.session-token='));

        if (!sessionCookie) {
            return null;
        }

        // Extract token value
        const token = sessionCookie.split('=')[1];

        // Parse JWT payload (middle part between dots)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        return payload;
    } catch (error) {
        console.error('Error parsing client token:', error);
        return null;
    }
}

/**
 * React hook to access JWT token data directly
 * @returns {Object} The token object and loading state
 */
export function useAuthToken() {
    const { data: session, status } = useSession();
    const isLoading = status === 'loading';

    // The token is not directly accessible from useSession()
    // So we use a custom function to extract it from cookies
    const token = status === 'authenticated' ? getClientToken() : null;

    return { token, isLoading };
}

/**
 * Protect client-side components based on authentication and role requirements
 * @param {React.Component} Component - The component to protect
 * @param {Object} options - Protection options
 * @param {string|string[]} [options.requiredRoles] - Required role(s)
 * @param {React.Component} [options.fallback] - Component to show when unauthorized
 * @returns {React.Component} The protected component
 */
export function withAuth(Component, options = {}) {
    const { requiredRoles, fallback: Fallback } = options;

    return function ProtectedComponent(props) {
        const { data: session, status } = useSession();
        const loading = status === 'loading';
        const isAuthenticated = status === 'authenticated';

        // Still loading
        if (loading) {
            return <div>Loading...</div>;
        }

        // Not authenticated
        if (!isAuthenticated) {
            if (Fallback) {
                return <Fallback reason="unauthenticated" />;
            }
            return <div>Please sign in to access this content</div>;
        }

        // Check roles if required
        if (requiredRoles && session?.user?.roles) {
            const hasRequiredRole = Array.isArray(requiredRoles)
                ? requiredRoles.some(role => session.user.roles.includes(role))
                : session.user.roles.includes(requiredRoles);

            if (!hasRequiredRole) {
                if (Fallback) {
                    return <Fallback reason="unauthorized" />;
                }
                return <div>You don't have permission to access this content</div>;
            }
        }

        // Authorized, render the protected component
        return <Component {...props} />;
    };
}