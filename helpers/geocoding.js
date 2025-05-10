export async function geocodeAddress(address, city, state, postalCode, country) {
    // Check if we have the essential components
    if (!address && !city) {
        console.error('Missing required address components');
        return null;
    }

    // Build address with only available components
    let addressParts = [];
    // if (address) addressParts.push(address);
    if (city) addressParts.push(city);
    if (state) addressParts.push(state);
    if (postalCode) addressParts.push(postalCode);
    if (country) addressParts.push(country);
    const formattedAddress = addressParts.join(', ');

    try {
        // Add delay to respect rate limits (optional but recommended)
        // await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formattedAddress)}&format=json&addressdetails=1&limit=1`,
            {
                headers: {
                    // Update with your actual app name and contact
                    'User-Agent': 'YourAppName/1.0 (contact@example.com)'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        // console.log('Raw API response:', data);

        if (data && data.length > 0) {
            const result = data[0];
            return {
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                displayName: result.display_name,
                placeId: result.place_id,
                osmType: result.osm_type,
                osmId: result.osm_id,
                type: result.type,
                class: result.class,
                importance: result.importance,
                addressDetails: result.address,
                boundingBox: result.boundingbox,
                license: result.licence
            };
        } else {
            console.warn('No geocoding results found for address:', formattedAddress);
            return null;
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

// Example usage:
// const location = await geocodeAddress('135 Pilkington Avenue', 'Birmingham', 'England', 'B72 1LH', 'United Kingdom');
// // console.log(location);