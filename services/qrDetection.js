// services/qrDetection.js

/**
 * Utility class for handling QR code detection
 * This service allows us to implement different detection methods
 * based on browser support and available libraries
 */
export class QRDetectionService {
    constructor() {
        this.hasBarcodeDetector = typeof window !== 'undefined' && 'BarcodeDetector' in window;
    }

    /**
     * Checks if native BarcodeDetector API is supported
     * @returns {boolean} Whether the BarcodeDetector API is available
     */
    isNativeDetectorSupported() {
        return this.hasBarcodeDetector;
    }

    /**
     * Detects QR codes in an image source (canvas, video, etc.)
     * @param {HTMLCanvasElement|HTMLVideoElement|ImageBitmap} imageSource - The source to scan
     * @returns {Promise<string|null>} The detected QR code value or null if none found
     */
    async detectQRCode(imageSource) {
        if (!imageSource) {
            throw new Error('No image source provided for QR detection');
        }

        // Use native BarcodeDetector if available
        if (this.hasBarcodeDetector) {
            try {
                const barcodeDetector = new window.BarcodeDetector({
                    formats: ['qr_code']
                });

                const barcodes = await barcodeDetector.detect(imageSource);

                if (barcodes && barcodes.length > 0) {
                    return barcodes[0].rawValue;
                }
            } catch (error) {
                console.error('Error using BarcodeDetector:', error);
            }
        }

        // For production, you should implement a fallback solution here
        // by importing a library like jsQR or zxing
        // Example fallback implementation would be:
        // 
        // if (typeof jsQR !== 'undefined') {
        //   const canvas = document.createElement('canvas');
        //   const context = canvas.getContext('2d');
        //   canvas.width = imageSource.width || imageSource.videoWidth;
        //   canvas.height = imageSource.height || imageSource.videoHeight;
        //   context.drawImage(imageSource, 0, 0, canvas.width, canvas.height);
        //   const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        //   const code = jsQR(imageData.data, imageData.width, imageData.height);
        //   if (code) {
        //     return code.data;
        //   }
        // }

        return null;
    }

    /**
     * Process a frame from video for QR scanning
     * @param {HTMLVideoElement} videoElement - The video element to process
     * @param {HTMLCanvasElement} canvasElement - Canvas to draw the video frame on
     * @returns {Promise<string|null>} Detected QR code value or null
     */
    async processVideoFrame(videoElement, canvasElement) {
        if (!videoElement || !canvasElement) {
            return null;
        }

        // Ensure video is playing and has enough data
        if (videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
            return null;
        }

        const context = canvasElement.getContext('2d', { willReadFrequently: true });

        // Set canvas dimensions to match video
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        // Draw current video frame to canvas
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        // Process the canvas to detect QR codes
        return await this.detectQRCode(canvasElement);
    }
}

// Export a singleton instance
export default new QRDetectionService();