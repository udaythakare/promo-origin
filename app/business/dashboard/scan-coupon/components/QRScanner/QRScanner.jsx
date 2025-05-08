'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, X, AlertTriangle } from 'lucide-react';
import Script from 'next/script';
import {
    isCameraSupported,
    checkCameraPermission,
    requestCameraPermission
} from '@/utils/cameraUtils';

/**
 * QR Code Scanner component using html5-qrcode library
 * Works on both mobile and desktop devices
 * 
 * @param {Object} props Component props
 * @param {Function} props.onDetected Callback called when a QR code is detected
 * @returns {JSX.Element} The QR Scanner component
 */
const QRScanner = ({ onDetected }) => {
    // State
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [scriptError, setScriptError] = useState(false);
    const [cameraSupported, setCameraSupported] = useState(true);
    const [cameraPermission, setCameraPermission] = useState(null); // null = unknown, true/false = granted/denied
    const [permissionRequested, setPermissionRequested] = useState(false);

    // Refs
    const scannerContainerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    // Check for camera support when component mounts
    useEffect(() => {
        const checkSupport = async () => {
            const supported = isCameraSupported();
            setCameraSupported(supported);

            if (supported) {
                const permission = await checkCameraPermission();
                setCameraPermission(permission);
            }
        };

        checkSupport();
    }, []);

    // Handle script loading
    const handleScriptLoad = () => {
        setScriptLoaded(true);
        setScriptError(false);

        // Configure global html5-qrcode style overrides
        if (window.Html5Qrcode) {
            // Apply some style fixes to make the scanner more responsive
            const style = document.createElement('style');
            style.textContent = `
        #qr-reader {
          border: none !important;
          width: 100% !important;
          padding: 0 !important;
        }
        #qr-reader video {
          max-height: 70vh !important;
          object-fit: cover !important;
        }
        #qr-reader__dashboard_section {
          padding: 0 !important;
        }
        #qr-reader__dashboard_section_csr button {
          margin-bottom: 8px !important;
        }
      `;
            document.head.appendChild(style);
        }
    };

    const handleScriptError = () => {
        setScriptError(true);
        console.error("Failed to load html5-qrcode script");
    };

    // Handle successful scan
    const onScanSuccess = (decodedText, decodedResult) => {
        // Stop scanner
        stopScanner();

        // Set the result
        setResult(decodedText);

        // Call onDetected callback if provided
        if (typeof onDetected === 'function') {
            onDetected(decodedText, decodedResult);
        } else {
            // Default behavior is to show alert
            alert(`QR Code detected: ${decodedText}`);
        }
    };

    // Handle scan failure (no QR code found in frame)
    const onScanFailure = (error) => {
        // We don't need to do anything here
        // Avoid logging errors to prevent console spam
    };

    // Stop the QR scanner
    const stopScanner = async () => {
        setScanning(false);

        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current = null; // Important: Set to null after stopping
            } catch (error) {
                console.error("Error stopping scanner:", error);
            }
        }
    };

    // Start the QR scanner
    const startScanner = async () => {
        if (!scriptLoaded || !window.Html5Qrcode) {
            alert("QR Scanner library not loaded yet. Please try again.");
            return;
        }

        if (!cameraSupported) {
            alert("Your device doesn't support camera access.");
            return;
        }

        // Request permission if not already granted
        if (cameraPermission === false && !permissionRequested) {
            const granted = await requestCameraPermission();
            setCameraPermission(granted);
            setPermissionRequested(true);

            if (!granted) {
                alert("Camera permission denied. Please allow camera access to scan QR codes.");
                return;
            }
        }

        setScanning(true);
        setResult('');

        try {
            // Clean up previous scanner instance if exists
            if (html5QrCodeRef.current) {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current = null;
            }

            // IMPORTANT: Use a small delay to ensure the DOM is ready
            setTimeout(() => {
                try {
                    // Find the element AFTER the state has been updated and the component has re-rendered
                    const qrReaderElement = document.getElementById("qr-reader");
                    if (!qrReaderElement) {
                        throw new Error("HTML Element with id=qr-reader not found");
                    }

                    // Clear any previous content
                    qrReaderElement.innerHTML = '';

                    // Create scanner with container id
                    const html5QrCode = new window.Html5Qrcode("qr-reader");
                    html5QrCodeRef.current = html5QrCode;

                    // Configure scanner
                    const config = {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        disableFlip: false,
                        formatsToSupport: [window.Html5QrcodeSupportedFormats.QR_CODE]
                    };

                    // Use environment facing camera by default (rear camera on mobile)
                    html5QrCode.start(
                        { facingMode: "environment" },
                        config,
                        onScanSuccess,
                        onScanFailure
                    ).catch(error => {
                        console.error("Error starting camera:", error);
                        setScanning(false);
                        alert(`Error accessing camera: ${error.message || 'Unknown error'}`);
                    });
                } catch (error) {
                    console.error("Error in scanner initialization:", error);
                    setScanning(false);
                    alert(`Error initializing scanner: ${error.message || 'Unknown error'}`);
                }
            }, 300); // Increased delay to ensure DOM is fully updated
        } catch (error) {
            console.error("Error starting scanner:", error);
            setScanning(false);
            alert(`Error accessing camera: ${error.message || 'Unknown error'}`);
        }
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch(err => console.error(err));
            }
        };
    }, []);

    return (
        <>
            {/* Load the html5-qrcode library */}
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js"
                onLoad={handleScriptLoad}
                onError={handleScriptError}
                strategy="afterInteractive"
            />

            <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
                <div className="w-full p-6 bg-yellow-300 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-3xl font-black mb-6 text-center tracking-tight">QR Code Scanner</h2>

                    {/* Error States */}
                    {!cameraSupported && (
                        <div className="mb-6 p-4 bg-red-400 text-black rounded-none border-4 border-black flex items-center gap-3">
                            <AlertTriangle size={24} className="text-black" />
                            <p className="font-bold">Your device or browser doesn't support camera access.</p>
                        </div>
                    )}

                    {scriptError && (
                        <div className="mb-6 p-4 bg-red-400 text-black rounded-none border-4 border-black flex items-center gap-3">
                            <AlertTriangle size={24} className="text-black" />
                            <p className="font-bold">Failed to load QR scanner library. Please refresh and try again.</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {!scriptLoaded && !scriptError && (
                        <div className="flex justify-center p-6">
                            <div className="animate-spin rounded-none h-16 w-16 border-4 border-black"></div>
                        </div>
                    )}

                    {/* Scanner Controls - Not Scanning */}
                    {scriptLoaded && !scanning && (
                        <div className="flex flex-col items-center space-y-6">
                            <button
                                onClick={startScanner}
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-green-400 text-black font-black rounded-none border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                                disabled={!scriptLoaded || !cameraSupported}
                            >
                                <Camera size={28} />
                                <span className="text-xl">START SCANNING</span>
                            </button>
                        </div>
                    )}

                    {/* Scanner Active */}
                    {scriptLoaded && scanning && (
                        <div className="flex flex-col items-center">
                            {/* Scanner container needs a specific ID for the library to work with */}
                            <div
                                id="qr-reader"
                                ref={scannerContainerRef}
                                className="w-full max-w-md rounded-none border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                            ></div>

                            <div className="mt-6">
                                <button
                                    onClick={stopScanner}
                                    className="flex items-center justify-center gap-3 px-6 py-4 bg-red-400 text-black font-black rounded-none border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    <X size={28} />
                                    <span className="text-xl">STOP SCANNING</span>
                                </button>
                            </div>

                            <p className="mt-6 text-center text-lg font-bold">
                                Position QR code within the frame to scan
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default QRScanner;