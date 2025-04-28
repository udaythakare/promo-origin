'use client';
import React, { useState, useEffect, useCallback } from 'react';
import QrScanner from 'react-qr-scanner';
import { supabase } from '@/lib/supabase';
import { getSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import { X } from 'lucide-react';

export default function ScanAttendance() {
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('');
    const [scanData, setScanData] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [showTroubleshooting, setShowTroubleshooting] = useState(false);

    useEffect(() => {
        const handleBackButton = (e) => {
            if (scanning) {
                e.preventDefault();
                stopCamera();
            }
        };

        if (scanning) {
            window.history.pushState(null, '', window.location.pathname);
            window.addEventListener('popstate', handleBackButton);
        }

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [scanning]);

    // Rest of initialization code
    useEffect(() => {
        initializeCameras();
    }, []);

    useEffect(() => {
        return () => {
            if (scanning) {
                stopCamera();
            }
        };
    }, [scanning]);

    const initializeCameras = async () => {
        try {
            setIsInitializing(true);
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            if (videoDevices.length === 0) {
                toast.error('No cameras found');
                return;
            }

            setCameras(videoDevices);

            // Try to get the stored camera preference
            const storedCamera = localStorage.getItem('selectedCamera');
            const backCamera = videoDevices.find(device =>
                device.label.toLowerCase().includes('back') ||
                device.label.toLowerCase().includes('rear')
            );

            // Set camera priority: stored > back camera > first available
            const cameraToUse = videoDevices.find(device => device.deviceId === storedCamera)
                ? storedCamera
                : backCamera
                    ? backCamera.deviceId
                    : videoDevices[0].deviceId;

            setSelectedCamera(cameraToUse);
            localStorage.setItem('selectedCamera', cameraToUse);
        } catch (error) {
            console.error('Failed to initialize cameras:', error);
            toast.error('Failed to access camera');
        } finally {
            setIsInitializing(false);
        }
    };

    const stopCamera = useCallback(() => {
        setScanning(false);
        // Clear scan results when stopping
        setScanResult(null);
        setScanData(null);
    }, []);



    // const handleScan = async (data) => {
    //     console.log('this is handleScane')
    //     if (data && data.text) {
    //         try {
    //             console.log('this is handle scan[')
    //             const qrData = JSON.parse(data.text);
    //             console.log(qrData, 'this is qr data')
    //             const { registeredInfoId, eventId, userId } = qrData;
    //             setScanData(qrData);

    //             const { data: existingAttendance } = await supabase
    //                 .from('event_attendance')
    //                 .select('*')
    //                 .eq('reg_id', registeredInfoId)
    //                 .eq('user_id', userId)
    //                 .single();

    //             if (existingAttendance) {
    //                 toast.info('Attendance already marked for this user');
    //                 stopCamera();
    //                 return;
    //             } else {
    //                 const session = await getSession();

    //                 const { error: insertError } = await supabase
    //                     .from('event_attendance')
    //                     .insert({
    //                         reg_id: registeredInfoId,
    //                         event_id: eventId,
    //                         user_id: userId,
    //                         marked_by: session.user.id,
    //                     });

    //                 if (insertError) throw insertError;
    //             }

    //             toast.success('Attendance marked successfully');
    //             setScanResult({
    //                 success: true,
    //                 message: 'Attendance marked successfully'
    //             });
    //             stopCamera();

    //             // Instead of stopping scanning, just pause briefly and reinitialize cameras
    //             setTimeout(async () => {
    //                 try {
    //                     const devices = await navigator.mediaDevices.enumerateDevices();
    //                     const videoDevices = devices.filter(device => device.kind === 'videoinput');
    //                     setCameras(videoDevices);

    //                     // Try to find back camera
    //                     const backCamera = videoDevices.find(device =>
    //                         device.label.toLowerCase().includes('back') ||
    //                         device.label.toLowerCase().includes('rear')
    //                     );

    //                     // Set the camera: prefer back camera, otherwise take the first available
    //                     setSelectedCamera(backCamera ? backCamera.deviceId : videoDevices[0]?.deviceId);
    //                 } catch (error) {
    //                     console.error('Error getting cameras:', error);
    //                     handleStopScanning(); // Fall back to stopping if there's an error
    //                 }
    //             }, 500); // Wait 1 second before reinitializing

    //             // Reset scan attempts on successful scan


    //         } catch (error) {
    //             console.error('Error marking attendance:', error);
    //             toast.error('Failed to mark attendance');
    //             setScanResult({
    //                 success: false,
    //                 message: 'Failed to mark attendance: ' + error.message,
    //             });
    //         }
    //     }
    // };

    // Add this at the top of your component to implement debouncing
    const [isProcessing, setIsProcessing] = useState(false);

    // The complete handleScan function
    const handleScan = async (data) => {
        // Prevent multiple scans while processing a QR code
        console.log('this is handle scan')
        if (isProcessing) {
            return;
        }

        console.log('Scan attempt detected', data);

        // Check if we have data
        if (!data || !data.text) {
            console.log('No valid scan data received');
            return;
        }

        try {
            // Set processing flag to prevent multiple scans
            setIsProcessing(true);
            console.log('QR content detected:', data.text);

            // Try to parse the JSON data
            let qrData;
            try {
                qrData = JSON.parse(data.text);
            } catch (parseError) {
                console.error('Failed to parse QR data as JSON:', parseError);
                toast.error('Invalid QR code format');
                setIsProcessing(false);
                return;
            }

            console.log('Successfully parsed QR data:', qrData);

            // Validate required fields
            const { registeredInfoId, eventId, userId } = qrData;
            if (!registeredInfoId || !eventId || !userId) {
                console.error('QR code missing required fields:', qrData);
                toast.error('Invalid QR code - missing required information');
                setIsProcessing(false);
                return;
            }

            // Store the scan data
            setScanData(qrData);

            // Check if attendance was already marked
            console.log('Checking for existing attendance...');
            const { data: existingAttendance, error: fetchError } = await supabase
                .from('event_attendance')
                .select('*')
                .eq('reg_id', registeredInfoId)
                .eq('user_id', userId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                // PGRST116 is the error code for "no rows returned"
                console.error('Error checking attendance:', fetchError);
                toast.error('Error checking attendance status');
                setIsProcessing(false);
                return;
            }

            if (existingAttendance) {
                console.log('Attendance already marked for this user');
                toast.info('Attendance already marked for this user');
                setScanResult({
                    success: true,
                    message: 'Attendance already marked for this user'
                });
                stopCamera();
                setIsProcessing(false);
                return;
            }

            // Get user session
            console.log('Getting user session...');
            const session = await getSession();
            if (!session || !session.user || !session.user.id) {
                console.error('No active user session found');
                toast.error('User session not found');
                setIsProcessing(false);
                return;
            }

            // Mark attendance
            console.log('Marking attendance...');
            const { error: insertError } = await supabase
                .from('event_attendance')
                .insert({
                    reg_id: registeredInfoId,
                    event_id: eventId,
                    user_id: userId,
                    marked_by: session.user.id,
                });

            if (insertError) {
                console.error('Error inserting attendance record:', insertError);
                toast.error('Failed to mark attendance: ' + insertError.message);
                setScanResult({
                    success: false,
                    message: 'Failed to mark attendance: ' + insertError.message,
                });
                setIsProcessing(false);
                return;
            }

            // Success!
            console.log('Attendance marked successfully');
            toast.success('Attendance marked successfully');
            setScanResult({
                success: true,
                message: 'Attendance marked successfully'
            });

            // Stop camera after successful scan
            stopCamera();

            // Reset processing flag
            setIsProcessing(false);

        } catch (error) {
            console.error('Unexpected error in handleScan:', error);
            toast.error('An unexpected error occurred');
            setScanResult({
                success: false,
                message: 'Failed to process QR code: ' + error.message,
            });
            setIsProcessing(false);
        }
    };
    const handleCameraChange = (e) => {
        const newCamera = e.target.value;
        setSelectedCamera(newCamera);
        localStorage.setItem('selectedCamera', newCamera);

        // Restart scanning if already active
        if (scanning) {
            setScanning(false);
            setTimeout(() => setScanning(true), 100);
        }
    };

    if (isInitializing) {
        return (
            <div className="container mx-auto px-8 py-8">
                <div className="max-w-md mx-auto text-center">
                    <p>Initializing camera...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <ToastContainer position="top-right" autoClose={2000} />

            {!scanning ? (
                <div className="container mx-auto px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-xl font-medium text-gray-800">Scan Attendance</h1>
                        <p className="text-sm text-gray-500 mt-1">Scan QR codes to mark attendance</p>
                    </div>

                    <div className="max-w-md mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <select
                                value={selectedCamera}
                                onChange={handleCameraChange}
                                className="w-full mr-2 p-2 border rounded-lg"
                            >
                                {cameras.map((camera) => (
                                    <option key={camera.deviceId} value={camera.deviceId}>
                                        {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => setScanning(true)}
                            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-medium"
                        >
                            Start Scanning
                        </button>
                    </div>
                </div>
            ) : (
                <div className="fixed inset-0 z-50 bg-black" style={{ height: '100dvh' }}>
                    {/* Close button - adjusted z-index to be above navbar */}
                    <button
                        onClick={stopCamera}
                        className="absolute top-4 right-4 z-[60] p-2 bg-black/50 rounded-full text-white"
                        aria-label="Close scanner"
                    >
                        <X size={24} />
                    </button>

                    {/* Scanner overlay - using full viewport height */}
                    <div className="relative h-full w-full">
                        <QrScanner
                            delay={300}
                            onScan={handleScan}
                            onError={(error) => {
                                console.error('Scanner error:', error);
                                toast.error('Scanner error occurred');
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            constraints={{
                                video: {
                                    deviceId: selectedCamera,
                                    facingMode: "environment"
                                }
                            }}
                        />

                        {/* Scanning overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>
                            </div>
                        </div>

                        {/* Scanning instructions */}
                        <div className="absolute bottom-16 left-0 right-0 text-center text-white">
                            <p className="text-lg mb-2">Position QR code within the frame</p>
                            <p className="text-sm text-gray-300">Keep your device steady</p>
                        </div>
                    </div>

                    {scanResult && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white rounded-t-xl">
                            <p className={`text-center ${scanResult.success ? 'text-green-600' : 'text-red-600'}`}>
                                {scanResult.message}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );


}
