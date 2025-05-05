'use client';

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Handles user logout functionality
 * @param {Object} options - Optional configuration
 * @param {string} options.redirectUrl - URL to redirect to after logout (defaults to '/')
 * @param {boolean} options.showFeedback - Whether to show feedback during logout process
 * @returns {Promise<void>}
 */
export const handleLogout = async ({
    redirectUrl = '/',
    showFeedback = false
} = {}) => {
    try {
        if (showFeedback) {
            // You can implement your UI feedback here (loading state, toast notification, etc.)
            console.log("Logging out...");
        }

        // Sign out the user using NextAuth/Auth.js
        await signOut({
            redirect: false, // We're handling redirect manually for more control
            callbackUrl: redirectUrl
        });

        // Additional cleanup if needed (clear local storage, cookies, etc.)
        localStorage.removeItem("user-preferences"); // Example of clearing local data

        // Use router to redirect
        window.location.href = redirectUrl;

        if (showFeedback) {
            console.log("Logout successful");
        }
    } catch (error) {
        console.error("Logout failed:", error);
        // Handle error (show error message, etc.)
    }
};

// Example Button Component with Logout Functionality
export const LogoutButton = ({
    className = "",
    redirectUrl = '/',
    children = "Logout"
}) => {
    const router = useRouter();

    const onLogout = async () => {
        try {
            // Sign out the user using NextAuth/Auth.js
            await signOut({
                redirect: false // We're handling redirect manually for more control
            });

            // Redirect after logout
            router.push(redirectUrl);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button
            onClick={onLogout}
            className={className}
        >
            {children}
        </button>
    );
};

// You can also create a custom hook for logout functionality
export const useLogout = () => {
    const router = useRouter();

    const logout = async (options = {}) => {
        const { redirectUrl = '/' } = options;

        try {
            await signOut({ redirect: false });
            router.push(redirectUrl);
            return { success: true };
        } catch (error) {
            console.error("Logout error:", error);
            return { success: false, error };
        }
    };

    return { logout };
};