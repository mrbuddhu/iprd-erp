import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../utils/translations';
import toast from 'react-hot-toast';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslations();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      return;
    }

    // Detect desktop
    const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // For desktop, show install button after user engagement
    if (isDesktop && user) {
      const timer = setTimeout(() => {
        setShowInstallButton(true);
      }, 2000);
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        clearTimeout(timer);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [user]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('App installed successfully! 🎉');
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } else {
      // Manual installation instructions for desktop
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      const isEdge = /Edg/.test(navigator.userAgent);
      
      if (isChrome || isEdge) {
        toast.info(
          '💡 To install: Look for the install icon (➕) in your browser address bar, or go to Menu (⋮) → "Install IPRD ERP"',
          { duration: 6000 }
        );
      } else {
        toast.info(
          '💡 Check your browser menu for "Install App" or "Add to Home Screen" option',
          { duration: 5000 }
        );
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-blue text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={onMenuClick}
                className="lg:hidden text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <Link to="/dashboard" className="flex items-center space-x-2 lg:space-x-3">
                <img
                  src="/bihar-logo-red.png"
                  alt="Bihar IPRD Logo"
                  className="h-6 lg:h-8 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="text-base lg:text-lg font-bold hidden sm:inline">IPRD ERP | Beta</span>
                <span className="text-base font-bold sm:hidden">IPRD | Beta</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
            {/* PWA Install Button - Desktop */}
            {showInstallButton && user && (
              <button
                onClick={handleInstallClick}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center space-x-1"
                title="Install IPRD ERP App"
              >
                <span>📱</span>
                <span className="hidden md:inline">Install App</span>
              </button>
            )}
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-lg transition-all text-sm font-medium flex items-center space-x-2"
              title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            >
              <span>{language === 'en' ? '🇮🇳' : '🇬🇧'}</span>
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
              {user && (
                <>
                  <span className="text-xs lg:text-sm hidden md:inline">
                    {t('navbar.welcome')}, {user.username}
                  </span>
                  <span className="text-xs lg:text-sm hidden lg:inline">
                    ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-primary-blue px-3 lg:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-xs lg:text-sm font-medium"
                  >
                    <span className="hidden sm:inline">{t('navbar.logout')}</span>
                    <span className="sm:hidden">🚪</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;

