export function joinAddress(addressObject) {
    if (!addressObject || typeof addressObject !== 'object') return '';

    const parts = [
        addressObject.address,
        addressObject.area,
        addressObject.city,
        addressObject.state,
        addressObject.postal_code,
    ]
        .filter((part) => part && part.toString().trim().length)  // drop null/empty
        .map((part) => part.toString().trim());

    return parts.join(', ');
}
