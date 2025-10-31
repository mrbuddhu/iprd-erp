import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../utils/translations';
import BackgroundLogo from '../components/BackgroundLogo';
import toast from 'react-hot-toast';
import mockData from '../data/mockData.json';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [username, setUsername] = useState('Guest');
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslations();

  const handleGuestLogin = () => {
    login('Guest', 'Guest User');
    navigate('/dashboard');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (isGuest) {
      handleGuestLogin();
      return;
    }
    if (selectedRole && username) {
      login(selectedRole, username);
      navigate('/dashboard');
    } else {
      toast.error('Please select a role and enter your name');
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'Guest') {
      setIsGuest(true);
      setUsername('Guest User');
    } else {
      setIsGuest(false);
      if (!username || username === 'Guest User') {
        setUsername('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue via-blue-600 to-accent flex items-center justify-center px-4 py-8 relative">
      <BackgroundLogo />
      <div className="bg-white rounded-2xl shadow-2xl p-5 lg:p-6 w-full max-w-md lg:max-w-lg transform transition-all hover:scale-105 relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-4 lg:mb-5 relative">
          <div className="flex justify-center mb-2 lg:mb-3">
            <img 
              src="/bihar-logo-red.png" 
              alt="Bihar IPRD Logo" 
              className="h-14 lg:h-20 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="absolute top-0 right-0 lg:top-2 lg:right-2">
            <button
              onClick={toggleLanguage}
              className="bg-primary-blue bg-opacity-20 hover:bg-opacity-30 text-primary-blue px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg transition-all text-xs lg:text-sm font-medium flex items-center space-x-1 lg:space-x-2"
              title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            >
              <span>{language === 'en' ? '🇮🇳' : '🇬🇧'}</span>
              <span className="hidden sm:inline">{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-primary-blue mb-1">
            {t('login.title')}
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">{t('login.subtitle')}</p>
        </div>

        {/* Guest Login Button */}
        <div className="mb-4 lg:mb-5">
          <button
            onClick={handleGuestLogin}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 lg:py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold text-sm lg:text-base shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>🔓</span>
            <span>{t('login.guestButton')}</span>
          </button>
        </div>

        <div className="relative mb-4 lg:mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs lg:text-sm">
            <span className="px-4 bg-white text-gray-500">{t('login.or')}</span>
          </div>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleLogin} className="space-y-3 lg:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.username')}
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isGuest}
              required={!isGuest}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('login.selectRole')}
            </label>
            <select
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all bg-white"
              value={selectedRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              required={!isGuest}
            >
              <option value="">-- {t('login.selectRole')} --</option>
              <option value="Guest">Guest ({t('common.select')} Full Access)</option>
              {mockData.roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
                 <button
                   type="submit"
                   className="w-full bg-primary-blue text-white py-2 lg:py-2.5 rounded-xl hover:bg-accent transition-all font-semibold text-sm lg:text-base shadow-lg transform hover:scale-105"
                 >
                   {t('login.loginButton')}
                 </button>
        </form>

        {/* Features Preview */}
        <div className="mt-4 lg:mt-5 pt-3 lg:pt-4 border-t border-gray-200">
          <p className="text-center text-xs text-gray-600 mb-2">{t('login.features.title')}</p>
          <div className="grid grid-cols-2 gap-1.5 lg:gap-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <span>✅</span>
              <span>{t('login.features.contentManagement')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>✅</span>
              <span>{t('login.features.videoLibrary')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>✅</span>
              <span>{t('login.features.searchFilter')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>✅</span>
              <span>{t('login.features.reportsAnalytics')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

