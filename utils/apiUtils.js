// API utility functions with cookie handling and caching
export const apiRequest = async (url, options = {}) => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            // Include cookies in the request
            ...options.headers,
        },
        credentials: 'include', // This ensures cookies are sent with the request
        ...options,
    };

    try {
        const response = await fetch(url, defaultOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};