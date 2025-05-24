//this is to fetch the coupons from time


// Get all coupons sorted by newest first
const newestCoupons = await fetchAllCoupons();

// Get oldest coupons first
const oldestCoupons = await fetchAllCoupons({ sortBy: 'oldest' });

// Get coupons from the last 7 days
const recentCoupons = await fetchRecentCoupons(7);

// Get latest 5 coupons
const latestFive = await fetchLatestCoupons(5);

// Get coupons from a specific date range
const couponsInRange = await fetchCouponsFromDateRange(
    '2024-01-01T00:00:00Z',
    '2024-12-31T23:59:59Z'
);

// Get area coupons with date filtering
const areaCoupons = await fetchAreaCoupons('Downtown', {
    sortBy: 'newest',
    dateFilter: {
        after: '2024-06-01T00:00:00Z'
    },
    limit: 20
});