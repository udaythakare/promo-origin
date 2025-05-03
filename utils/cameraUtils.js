// utils/cameraUtils.js
/**
 * Helper functions for camera access and permissions
 */

/**
 * Check if the browser has camera access capability
 * @returns {boolean} whether camera access is supported
 */
export const isCameraSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

/**
 * Check if the user has granted camera permissions
 * @returns {Promise<boolean>} whether camera permission is granted
 */
export const checkCameraPermission = async () => {
    try {
        // Try to get camera access
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // If successful, stop all tracks and return true
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (err) {
        // Permission denied or other error
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            return false;
        }

        // Some other error occurred (e.g., no camera hardware)
        console.error('Camera permission check error:', err);
        return false;
    }
};

/**
 * Request camera permission from the user
 * @returns {Promise<boolean>} whether permission was granted
 */
export const requestCameraPermission = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment' // Prefer rear camera
            }
        });

        // If successful, stop all tracks and return true
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (err) {
        console.error('Camera permission request error:', err);
        return false;
    }
};

/**
 * Get list of available video input devices (cameras)
 * @returns {Promise<Array>} Array of camera devices
 */
export const getAvailableCameras = async () => {
    try {
        // First request permission to ensure we can access device names
        await navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                stream.getTracks().forEach(track => track.stop());
            });

        // Get all media devices
        const devices = await navigator.mediaDevices.enumerateDevices();

        // Filter for video input devices
        return devices.filter(device => device.kind === 'videoinput');
    } catch (err) {
        console.error('Error getting available cameras:', err);
        return [];
    }
};

/**
 * Helper function to get the most appropriate camera
 * Tries to select the back camera on mobile devices
 * @returns {Promise<string|null>} deviceId of the selected camera or null
 */
export const getPreferredCamera = async () => {
    try {
        const cameras = await getAvailableCameras();

        if (cameras.length === 0) {
            return null;
        }

        // Try to find a back camera (which often has "back" in the label on mobile)
        const backCamera = cameras.find(camera =>
            camera.label.toLowerCase().includes('back') ||
            camera.label.toLowerCase().includes('rear')
        );

        // Return back camera if found, otherwise the first camera
        return backCamera ? backCamera.deviceId : cameras[0].deviceId;
    } catch (err) {
        console.error('Error selecting preferred camera:', err);
        return null;
    }
};