import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      // App is already installed
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success('App installed successfully! 🎉');
    } else {
      toast.info('App installation cancelled');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">Install IPRD ERP</h3>
          <p className="text-sm text-gray-600 mb-3">
            Install this app on your device for quick access and offline functionality.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
            >
              Install App
            </button>
            <button
              onClick={() => {
                setShowInstallButton(false);
                setDeferredPrompt(null);
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Not Now
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            setShowInstallButton(false);
            setDeferredPrompt(null);
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;

