'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, X, AlertTriangle } from 'lucide-react';
import Script from 'next/script';
import { useLanguage } from '@/context/LanguageContext';

import {
    isCameraSupported,
    checkCameraPermission,
    requestCameraPermission
} from '@/utils/cameraUtils';

/**
 * QR Code Scanner component using html5-qrcode
 * Supports LocalGrow language system + brand design
 */

const QRScanner = ({ onDetected }) => {

    const { t } = useLanguage();

    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [scriptError, setScriptError] = useState(false);
    const [cameraSupported, setCameraSupported] = useState(true);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [permissionRequested, setPermissionRequested] = useState(false);

    const scannerContainerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    /* ------------------------------------------------ */
    /* Check camera support */
    /* ------------------------------------------------ */

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

    /* ------------------------------------------------ */
    /* Script loading */
    /* ------------------------------------------------ */

    const handleScriptLoad = () => {
        setScriptLoaded(true);
        setScriptError(false);

        if (window.Html5Qrcode) {
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
      `;
            document.head.appendChild(style);
        }
    };

    const handleScriptError = () => {
        setScriptError(true);
        console.error("Failed to load html5-qrcode script");
    };

    /* ------------------------------------------------ */
    /* Scan success */
    /* ------------------------------------------------ */

    const onScanSuccess = (decodedText, decodedResult) => {

        stopScanner();
        setResult(decodedText);

        if (typeof onDetected === 'function') {
            onDetected(decodedText, decodedResult);
        } else {
            alert(`${t?.scanner?.detected ?? "QR Code detected"}: ${decodedText}`);
        }
    };

    const onScanFailure = () => { };

    /* ------------------------------------------------ */
    /* Stop scanner */
    /* ------------------------------------------------ */

    const stopScanner = async () => {

        setScanning(false);

        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current = null;
            } catch (error) {
                console.error("Error stopping scanner:", error);
            }
        }
    };

    /* ------------------------------------------------ */
    /* Start scanner */
    /* ------------------------------------------------ */

    const startScanner = async () => {

        if (!scriptLoaded || !window.Html5Qrcode) {
            alert(t?.scanner?.libraryNotLoaded ?? "Scanner library not loaded yet.");
            return;
        }

        if (!cameraSupported) {
            alert(t?.scanner?.cameraNotSupported ?? "Camera not supported.");
            return;
        }

        if (cameraPermission === false && !permissionRequested) {

            const granted = await requestCameraPermission();

            setCameraPermission(granted);
            setPermissionRequested(true);

            if (!granted) {
                alert(t?.scanner?.permissionDenied ?? "Camera permission denied.");
                return;
            }
        }

        setScanning(true);
        setResult('');

        try {

            if (html5QrCodeRef.current) {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current = null;
            }

            setTimeout(() => {

                try {

                    const qrReaderElement = document.getElementById("qr-reader");

                    if (!qrReaderElement) {
                        throw new Error("QR container not found");
                    }

                    qrReaderElement.innerHTML = '';

                    const html5QrCode = new window.Html5Qrcode("qr-reader");

                    html5QrCodeRef.current = html5QrCode;

                    const config = {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        formatsToSupport: [window.Html5QrcodeSupportedFormats.QR_CODE]
                    };

                    html5QrCode.start(
                        { facingMode: "environment" },
                        config,
                        onScanSuccess,
                        onScanFailure
                    ).catch(error => {

                        console.error("Camera start error:", error);

                        setScanning(false);

                        alert(error.message);
                    });

                } catch (error) {

                    console.error("Scanner init error:", error);

                    setScanning(false);

                    alert(error.message);
                }

            }, 300);

        } catch (error) {

            console.error("Start scanner error:", error);

            setScanning(false);
        }
    };

    /* ------------------------------------------------ */
    /* Cleanup */
    /* ------------------------------------------------ */

    useEffect(() => {

        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch(err => console.error(err));
            }
        };

    }, []);

    /* ------------------------------------------------ */
    /* UI */
    /* ------------------------------------------------ */

    return (
        <>
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js"
                onLoad={handleScriptLoad}
                onError={handleScriptError}
                strategy="afterInteractive"
            />

            <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">

                <div className="w-full p-6 bg-[#df6824] text-black rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

                    <h2 className="text-3xl font-black mb-6 text-center tracking-tight">
                        {t?.scanner?.title ?? "QR Code Scanner"}
                    </h2>

                    {/* Camera not supported */}

                    {!cameraSupported && (
                        <div className="mb-6 p-4 bg-white border-4 border-black flex items-center gap-3">

                            <AlertTriangle size={24} />

                            <p className="font-bold">
                                {t?.scanner?.cameraNotSupported ?? "Camera not supported on this device"}
                            </p>

                        </div>
                    )}

                    {/* Script error */}

                    {scriptError && (
                        <div className="mb-6 p-4 bg-white border-4 border-black flex items-center gap-3">

                            <AlertTriangle size={24} />

                            <p className="font-bold">
                                {t?.scanner?.scriptError ?? "Scanner failed to load"}
                            </p>

                        </div>
                    )}

                    {/* Loading */}

                    {!scriptLoaded && !scriptError && (
                        <div className="flex justify-center p-6">

                            <div className="animate-spin h-16 w-16 border-4 border-black"></div>

                        </div>
                    )}

                    {/* Start button */}

                    {scriptLoaded && !scanning && (

                        <div className="flex flex-col items-center space-y-6">

                            <button
                                onClick={startScanner}
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-black text-white font-black border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 transition-all"
                            >

                                <Camera size={28} />

                                <span className="text-xl">
                                    {t?.scanner?.start ?? "START SCANNING"}
                                </span>

                            </button>

                        </div>
                    )}

                    {/* Scanner */}

                    {scriptLoaded && scanning && (

                        <div className="flex flex-col items-center">

                            <div
                                id="qr-reader"
                                ref={scannerContainerRef}
                                className="w-full max-w-md border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                            />

                            <div className="mt-6">

                                <button
                                    onClick={stopScanner}
                                    className="flex items-center gap-3 px-6 py-4 bg-black text-white font-black border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 transition-all"
                                >

                                    <X size={28} />

                                    <span className="text-xl">
                                        {t?.scanner?.stop ?? "STOP SCANNING"}
                                    </span>

                                </button>

                            </div>

                            <p className="mt-6 text-lg font-bold text-center">

                                {t?.scanner?.instruction ?? "Place QR code inside the frame"}

                            </p>

                        </div>

                    )}

                </div>

            </div>
        </>
    );
};

export default QRScanner;