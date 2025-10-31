import React, { useState, useEffect } from 'react';
import mockData from '../data/mockData.json';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Get logs from localStorage or use mock data
    const localLogs = JSON.parse(localStorage.getItem('iprd_audit_logs') || '[]');
    const allLogs = [...mockData.auditLogs, ...localLogs];
    // Sort by date (newest first)
    allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    setLogs(allLogs);
  }, []);

  // Refresh logs when component mounts or when localStorage changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      const localLogs = JSON.parse(localStorage.getItem('iprd_audit_logs') || '[]');
      const allLogs = [...mockData.auditLogs, ...localLogs];
      allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      setLogs(allLogs);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Audit Logs</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">File</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.slice(0, 5).map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">{log.user}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        log.action === 'Upload' ? 'bg-green-100 text-green-800' :
                        log.action === 'Delete' ? 'bg-red-100 text-red-800' :
                        log.action === 'Share' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{log.file}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{log.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{log.ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="bg-primary-blue text-white px-6 py-3 rounded-xl hover:bg-accent transition-colors font-semibold">
          View Full Logs → Coming Soon
        </button>
      </div>
    </div>
  );
};

export default AuditLogs;

