import React, { useState, useEffect } from 'react';
import mockData from '../data/mockData.json';

const StorageIndicator = () => {
  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 0, percentage: 0 });

  useEffect(() => {
    const calculateStorage = () => {
      try {
        const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
        const allContent = [...mockData.videos, ...localContent];
        
        // Estimate storage (rough calculation)
        const totalSize = allContent.reduce((sum, item) => {
          return sum + (item.metadata?.fileSize || 0);
        }, 0);
        
        // Get localStorage usage
        let localStorageSize = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            localStorageSize += localStorage[key].length + key.length;
          }
        }
        
        const maxStorage = 10 * 1024 * 1024; // 10MB typical localStorage limit
        const usedStorage = localStorageSize;
        const percentage = Math.min(100, (usedStorage / maxStorage) * 100);
        
        setStorageInfo({
          used: usedStorage,
          total: maxStorage,
          percentage,
          items: allContent.length
        });
      } catch (error) {
        console.error('Error calculating storage:', error);
      }
    };

    calculateStorage();
    const interval = setInterval(calculateStorage, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getColor = () => {
    if (storageInfo.percentage > 80) return 'bg-red-500';
    if (storageInfo.percentage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Storage Usage</span>
        <span className="text-xs text-gray-500">
          {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.total)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all ${getColor()}`}
          style={{ width: `${storageInfo.percentage}%` }}
        />
      </div>
      <div className="text-xs text-gray-500">
        {storageInfo.items || 0} items stored • {storageInfo.percentage.toFixed(1)}% used
      </div>
    </div>
  );
};

export default StorageIndicator;

