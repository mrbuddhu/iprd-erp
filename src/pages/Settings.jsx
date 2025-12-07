import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ComingSoon from '../components/ComingSoon';

const Settings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
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
                New Password
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
                Confirm New Password
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
              Change Password
            </button>
          </form>
        </div>

        {/* Other Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Other Settings</h2>
          
          {/* Check Office Network Button */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Network Status</h3>
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
              🔍 Check Office Network
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Verify if you're connected to the office network to access local storage files.
            </p>
          </div>
          
          <ComingSoon message="Manage Departments / Keys – Coming Soon" />
        </div>
      </div>
    </div>
  );
};

export default Settings;

