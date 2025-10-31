import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from '../utils/translations';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslations();

  const menuItems = [
    { path: '/dashboard', label: 'sidebar.dashboard', icon: '📊', access: ['all'] },
    { path: '/master-settings', label: 'sidebar.masterSettings', icon: '⚙️', access: ['Super Admin', 'Dept Admin'] },
    { path: '/add-content', label: 'sidebar.addContent', icon: '➕', access: ['Super Admin', 'Dept Admin', 'District Officer', 'Block Officer', 'Staff'] },
    { path: '/video-library', label: 'sidebar.library', icon: '📁', access: ['Super Admin', 'Dept Admin', 'District Officer', 'Block Officer', 'Staff'] },
    { path: '/search', label: 'sidebar.search', icon: '🔍', access: ['all'] },
    { path: '/share', label: 'sidebar.share', icon: '📤', access: ['Super Admin', 'Dept Admin', 'District Officer', 'Block Officer', 'Staff'] },
    { path: '/reports', label: 'sidebar.reports', icon: '📈', access: ['Super Admin', 'Dept Admin'] },
    { path: '/audit-logs', label: 'sidebar.auditLogs', icon: '📋', access: ['Super Admin', 'Dept Admin'] },
    { path: '/settings', label: 'sidebar.settings', icon: '🔧', access: ['Super Admin', 'Dept Admin'] },
    { path: '/help', label: 'sidebar.helpCenter', icon: '❓', access: ['all'] },
  ];

  const canAccess = (item) => {
    if (!user) return false;
    if (user.role === 'Guest') return true; // Guest has access to everything
    if (item.access.includes('all')) return true;
    return item.access.includes(user.role);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-lg min-h-screen
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <span className="text-xl font-bold text-primary-blue">IPRD ERP</span>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-full pb-20">
          <nav className="space-y-2">
            {menuItems.filter(canAccess).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  // Close sidebar on mobile when link is clicked
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{t(item.label)}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

