import { supabase } from '@/lib/supabase';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export async function logLogin(user_id, status, message = null) {
    try {
        await supabase.from('login_logs').insert({
            user_id,
            status,
            message,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error logging login:', error);
    }
}

/**
 * Gets the NextAuth JWT token and its contents from server components or API routes
 * @param {Object} options - Options for token retrieval
 * @param {Request} [options.req] - Request object (for API routes)
 * @param {string} [options.cookieName] - Optional custom cookie name
 * @returns {Promise<Object|null>} The decoded JWT token or null if not authenticated
 */
export async function getAuthToken(options = {}) {
    try {
        const { req, cookieName } = options;

        // For API routes that have access to the request object
        if (req) {
            return await getToken({
                req,
                secret: process.env.NEXTAUTH_SECRET,
                cookieName: cookieName || 'next-auth.session-token'
            });
        }

        // For server components using the newer Next.js cookies() API
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get(cookieName || 'next-auth.session-token');

        if (!tokenCookie?.value) {
            return null;
        }

        // Use getToken with a mock request object containing the cookie
        const token = await getToken({
            req: {
                cookies: {
                    [cookieName || 'next-auth.session-token']: tokenCookie.value
                }
            },
            secret: process.env.NEXTAUTH_SECRET
        });

        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
}

/**
 * Server-side helper to check if user has a specific role
 * @param {Object} options - Options for role checking
 * @param {Request} [options.req] - Request object (for API routes)
 * @param {string|string[]} options.requiredRoles - Required role(s) to check for
 * @returns {Promise<boolean>} True if user has the required role(s)
 */
export async function checkUserRole({ req, requiredRoles }) {
    const token = await getAuthToken({ req });

    if (!token || !token.roles || token.roles.length === 0) {
        return false;
    }

    // Check if user has any of the required roles
    if (Array.isArray(requiredRoles)) {
        return requiredRoles.some(role => token.roles.includes(role));
    }

    // Check for a single required role
    return token.roles.includes(requiredRoles);
}

/**
 * Get current user data from server side
 * @param {Object} options - Options for user data retrieval 
 * @param {Request} [options.req] - Request object (for API routes)
 * @returns {Promise<Object|null>} User data or null if not authenticated
 */
export async function getCurrentUser(options = {}) {
    const token = await getAuthToken(options);

    if (!token) {
        return null;
    }

    return {
        id: token.id,
        email: token.email,
        username: token.username,
        roles: token.roles || [],
        primaryRole: token.roles?.[0] || null,
        provider: token.provider
    };
}