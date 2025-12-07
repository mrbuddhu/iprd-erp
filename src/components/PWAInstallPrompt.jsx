import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone ||
                        document.referrer.includes('android-app://');
    
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect desktop
    const isDesktopDevice = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsDesktop(isDesktopDevice);

    const handler = (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For desktop, also check if install is possible via other means
    if (isDesktopDevice) {
      // Check if browser supports installation
      const isInstallable = 'serviceWorker' in navigator && 
                           window.matchMedia('(display-mode: standalone)').matches === false;
      
      // Show install button on desktop after a delay (user engagement)
      const timer = setTimeout(() => {
        if (!deferredPrompt && isInstallable) {
          // On desktop, show manual install instructions
          setShowInstallButton(true);
        }
      }, 3000); // Show after 3 seconds

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        clearTimeout(timer);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
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
    } else if (isDesktop) {
      // Desktop manual installation instructions
      toast.info(
        '💡 Desktop Installation:\n1. Click the install icon (➕) in your browser address bar\n2. Or go to Menu → "Install IPRD ERP"\n3. Or use the Install button in Settings',
        { duration: 6000 }
      );
    }
  };

  if (isInstalled || !showInstallButton) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-sm">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">Install IPRD ERP</h3>
          <p className="text-sm text-gray-600 mb-3">
            {isDesktop 
              ? 'Install this app for quick access. Look for the install icon (➕) in your browser address bar, or use browser menu.'
              : 'Install this app on your device for quick access and offline functionality.'}
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

