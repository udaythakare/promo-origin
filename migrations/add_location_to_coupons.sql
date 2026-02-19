-- Add city and state columns to coupons table
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS state TEXT;

-- Backfill existing coupons with their business's primary location
UPDATE coupons c
SET city = bl.city, state = bl.state
FROM business_locations bl
WHERE bl.business_id = c.business_id
  AND bl.is_primary = true
  AND c.city IS NULL;

-- For any remaining coupons without a primary location, use any location
UPDATE coupons c
SET city = bl.city, state = bl.state
FROM (
    SELECT DISTINCT ON (business_id) business_id, city, state
    FROM business_locations
    ORDER BY business_id, id
) bl
WHERE bl.business_id = c.business_id
  AND c.city IS NULL;
