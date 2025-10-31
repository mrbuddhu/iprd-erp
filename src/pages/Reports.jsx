import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import ComingSoon from '../components/ComingSoon';
import toast from 'react-hot-toast';
import mockData from '../data/mockData.json';

const Reports = () => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');

  // Get all content from localStorage
  const allContent = useMemo(() => {
    const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
    return [...mockData.videos, ...localContent];
  }, []);

  // Filter by date range if provided
  const filteredContent = useMemo(() => {
    if (!dateFrom && !dateTo) return allContent;
    return allContent.filter(item => {
      const uploadDate = item.uploadDate || item.date;
      if (!uploadDate) return false;
      const itemDate = new Date(uploadDate);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;
      
      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      return true;
    });
  }, [allContent, dateFrom, dateTo]);

  // Prepare data for charts
  const departmentData = useMemo(() => {
    const deptCounts = {};
    filteredContent.forEach(item => {
      const dept = item.department || 'Unknown';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    return Object.entries(deptCounts).map(([name, value]) => ({ name, value }));
  }, [filteredContent]);

  const contentTypeData = useMemo(() => {
    const typeCounts = {};
    filteredContent.forEach(item => {
      const type = item.contentType || 'Other';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  }, [filteredContent]);

  // Monthly data
  const monthlyData = useMemo(() => {
    const monthCounts = {};
    filteredContent.forEach(item => {
      const date = item.uploadDate || item.date;
      if (!date) return;
      const month = new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    return Object.entries(monthCounts)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([month, uploads]) => ({ month, uploads }));
  }, [filteredContent]);

  const COLORS = ['#003399', '#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#cbd5e1'];

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Content Name', 'Department', 'District', 'Block', 'Content Type', 'Upload Date', 'Source'];
    const rows = filteredContent.map(item => [
      item.title || item.contentName || 'N/A',
      item.department || 'N/A',
      item.district || 'N/A',
      item.block || 'N/A',
      item.contentType || 'N/A',
      item.uploadDate || item.date || 'N/A',
      item.source || 'cloud'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IPRD_Reports_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported to CSV successfully!');
  };

  // Export to JSON
  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredContent, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IPRD_Reports_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported to JSON successfully!');
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      handleExportCSV();
    } else {
      handleExportJSON();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <div className="flex gap-3">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            placeholder="From Date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            placeholder="To Date"
          />
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Total Content</p>
          <p className="text-2xl font-bold text-primary-blue">{filteredContent.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Departments</p>
          <p className="text-2xl font-bold text-primary-blue">{departmentData.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">Content Types</p>
          <p className="text-2xl font-bold text-primary-blue">{contentTypeData.length}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart: Uploads by Department */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Uploads by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Uploads by Month */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Uploads by Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uploads" stroke="#003399" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Content by Type */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Content by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#003399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ComingSoon message="More detailed reports and analytics coming soon!" />
    </div>
  );
};

export default Reports;

