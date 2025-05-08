export async function generateUniqueUsername(fullName) {
    const baseName = fullName.toLowerCase().replace(/[^a-z\s]/g, ''); // allow space
    const nameParts = baseName.split(' ').filter(Boolean);
    const first = nameParts[0] || 'user';
    const last = nameParts[1] || '';
    const time = Date.now().toString().slice(-4); // last 4 digits of timestamp
    const rand = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

    const patterns = [
        () => `${first}${last}${rand}`,
        () => `${first}_${last}_${time}`,
        () => `${last}${first}${rand}`,
        () => `${first.slice(0, 3)}${last.slice(0, 3)}${rand}`,
        () => `${first}${rand}${last.slice(0, 2)}`,
        () => `${first}_${Math.random().toString(36).substring(2, 6)}`, // alphanumeric
        () => `${first}${last}_${Math.floor(Math.random() * 100000)}`
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return pattern();
}
