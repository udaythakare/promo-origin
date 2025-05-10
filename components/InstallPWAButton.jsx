"use client";
import { useState, useEffect } from 'react';

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // console.log('[PWA] beforeinstallprompt event fired');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if the app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    // console.log('[PWA] Is running in standalone mode:', isStandalone);
    if (isStandalone) {
      setShowInstallButton(false);
      // console.log('[PWA] App is already installed, hiding install button.');
    }

    // Check for manifest link
    const manifest = document.querySelector('link[rel="manifest"]');
    // console.log('[PWA] Manifest present:', !!manifest);

    // Check for service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        // console.log('[PWA] Service worker registrations:', regs.length);
      });
    } else {
      // console.log('[PWA] Service workers not supported in this browser.');
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // console.log('[PWA] User choice:', outcome);

    // We no longer need the prompt. Clear it up
    setDeferredPrompt(null);

    // Hide the install button if the app was installed
    if (outcome === 'accepted') {
      setShowInstallButton(false);
      // console.log('[PWA] App installed, hiding install button.');
    }
  };

  if (!showInstallButton) {
    // console.log('[PWA] Install button not shown.');
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="px-6 py-3 bg-green-100 border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold text-sm sm:text-base whitespace-nowrap flex items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Install App
    </button>
  );
};

export default InstallPWAButton; 