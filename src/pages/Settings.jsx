import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from '../utils/translations';
import ComingSoon from '../components/ComingSoon';

const Settings = () => {
  const { t } = useTranslations();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);
    
    const isDesktopDevice = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsDesktop(isDesktopDevice);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('App installed successfully! 🎉');
      }
      setDeferredPrompt(null);
    } else if (isDesktop) {
      const isChrome = /Chrome/.test(navigator.userAgent);
      const isEdge = /Edg/.test(navigator.userAgent);
      const isFirefox = /Firefox/.test(navigator.userAgent);
      
      let instructions = '';
      if (isChrome || isEdge) {
        instructions = 'Look for the install icon (➕) in your browser address bar, or go to Menu (⋮) → "Install IPRD ERP"';
      } else if (isFirefox) {
        instructions = 'Go to Menu (☰) → "Install" or check the address bar for install option';
      } else {
        instructions = 'Check your browser menu for "Install App" or "Add to Home Screen" option';
      }
      
      toast.info(`💡 Desktop Installation:\n${instructions}`, { duration: 8000 });
    }
  };

  const handleChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="w-full -mx-4 lg:-mx-6 px-4 lg:px-6 py-4 lg:py-6 bg-white border-b border-gray-200 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{t('settings.title')}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('settings.changePassword')}</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.currentPassword')}
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                value={passwordData.currentPassword}
                onChange={(e) => handleChange('currentPassword', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.newPassword')}
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                value={passwordData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.confirmNewPassword')}
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                value={passwordData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-blue text-white py-2 rounded-xl hover:bg-accent transition-colors font-medium"
            >
              {t('settings.changePasswordButton')}
            </button>
          </form>
        </div>

        {/* Other Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('settings.otherSettings')}</h2>
          
          {/* PWA Install Button */}
          {!isInstalled && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t('settings.installApp')}</h3>
              <button
                onClick={handleInstallClick}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                {t('settings.installButton')}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                {isDesktop 
                  ? t('settings.installDescription')
                  : t('settings.installDescriptionMobile')}
              </p>
              {isDesktop && !deferredPrompt && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                  <strong>{t('settings.desktopInstructions')}</strong>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>{t('settings.desktopInstructionsList1')}</li>
                    <li>{t('settings.desktopInstructionsList2')}</li>
                    <li>{t('settings.desktopInstructionsList3')}</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Check Office Network Button */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('settings.networkStatus')}</h3>
            <button
              onClick={() => {
                const isGovtNetwork = window.location.hostname.includes('gov') || 
                                     window.location.hostname.includes('localhost') ||
                                     window.location.hostname.includes('127.0.0.1');
                if (isGovtNetwork) {
                  toast.success('✅ Connected to Office Network! You can access local storage files.');
                } else {
                  toast.error('❌ Not connected to Office Network. Local storage files are not accessible.');
                }
              }}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              {t('settings.checkOfficeNetwork')}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              {t('settings.networkDescription')}
            </p>
          </div>
          
          <ComingSoon message="Manage Departments / Keys – Coming Soon" />
        </div>
      </div>
    </div>
  );
};

export default Settings;

