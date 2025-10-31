import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonCard from '../components/SkeletonCard';
import mockData from '../data/mockData.json';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // Calculate statistics dynamically from localStorage and mockData
  const stats = useMemo(() => {
    const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
    const localShares = JSON.parse(localStorage.getItem('iprd_shares') || '[]');
    const allContent = [...mockData.videos, ...localContent];
    const allShares = [...mockData.shares, ...localShares];
    
    // Count cloud vs local
    const cloudCount = allContent.filter(item => item.source === 'cloud').length;
    const localCount = allContent.filter(item => item.source === 'local').length;
    const totalContent = allContent.length;
    
    // Calculate percentages
    const cloudPercent = totalContent > 0 ? Math.round((cloudCount / totalContent) * 100) : 0;
    const localPercent = totalContent > 0 ? Math.round((localCount / totalContent) * 100) : 0;
    
    // Count tag usage
    const tagCounts = {};
    allContent.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => {
          const tagType = tag.type || tag;
          tagCounts[tagType] = (tagCounts[tagType] || 0) + 1;
        });
      }
    });
    
    const topTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalUploads: allContent.length || mockData.statistics.totalUploads,
      totalSearches: parseInt(localStorage.getItem('iprd_search_count') || '0') || mockData.statistics.totalSearches,
      totalShares: allShares.length || mockData.statistics.totalShares,
      cloudData: cloudPercent || mockData.statistics.cloudData,
      localData: localPercent || mockData.statistics.localData,
      topTags: topTags.length > 0 ? topTags : mockData.topTags,
      recentUploads: allContent
        .sort((a, b) => new Date(b.uploadDate || b.date || 0) - new Date(a.uploadDate || a.date || 0))
        .slice(0, 5)
    };
  }, []);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Uploads"
          value={stats.totalUploads}
          icon="📁"
        />
        <DashboardCard
          title="Total Searches"
          value={stats.totalSearches}
          icon="🔍"
        />
        <DashboardCard
          title="Total Shares"
          value={stats.totalShares}
          icon="📤"
        />
        <DashboardCard
          title="Cloud vs Local Data"
          value={`${stats.cloudData}% / ${stats.localData}%`}
          icon="☁️"
          subtitle={`Cloud: ${stats.cloudData}% | Local: ${stats.localData}%`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Tags */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Tags Used</h2>
          <div className="space-y-3">
            {stats.topTags.length > 0 ? (
              stats.topTags.map((tag, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{index + 1}.</span>
                    <span className="px-3 py-1 bg-primary-blue text-white text-sm rounded-full">
                      {tag.name}
                    </span>
                  </div>
                  <span className="text-gray-600 font-medium">{tag.count} uses</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No tags yet</p>
            )}
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Uploads</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Title</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Department</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUploads.length > 0 ? (
                  stats.recentUploads.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-2 text-sm text-gray-700">{item.title || item.contentName}</td>
                      <td className="py-2 text-sm text-gray-600">{item.department}</td>
                      <td className="py-2 text-sm text-gray-600">{item.uploadDate || item.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500 text-sm">
                      No uploads yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Full Analytics Button */}
      <div className="flex justify-center">
        <Link
          to="/reports"
          className="bg-primary-blue text-white px-8 py-3 rounded-xl hover:bg-accent transition-colors font-semibold"
        >
          Full Analytics → Coming Soon
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

