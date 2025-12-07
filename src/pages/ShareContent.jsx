import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createAuditLog } from '../utils/auditLog';
import VideoPlayer from '../components/VideoPlayer';
import toast from 'react-hot-toast';
import mockData from '../data/mockData.json';

const ShareContent = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    department: '',
    personName: '',
    fileName: '',
    email: '',
    mobile: '',
    remarks: ''
  });

  const [shares, setShares] = useState([]);
  const [isClipShare, setIsClipShare] = useState(false);
  const [clipData, setClipData] = useState(null);

  useEffect(() => {
    // Check if there's pending clip share data
    const pendingShare = localStorage.getItem('iprd_pending_share');
    if (pendingShare) {
      try {
        const clipShareData = JSON.parse(pendingShare);
        setClipData(clipShareData);
        setIsClipShare(true);
        // Auto-fill form with clip data
        setFormData(prev => ({
          ...prev,
          fileName: clipShareData.fileName + ` [Clip: ${clipShareData.clipStart} - ${clipShareData.clipEnd}]`,
          remarks: `Video Clip Share - ${clipShareData.tagType}\nTime Range: ${clipShareData.clipStart} to ${clipShareData.clipEnd}\nDuration: ${clipShareData.clipDuration}\n${prev.remarks || ''}`
        }));
      } catch (error) {
        console.error('Error parsing pending share:', error);
      }
    }
    
    // Get shares from localStorage or use mock data
    const localShares = JSON.parse(localStorage.getItem('iprd_shares') || '[]');
    setShares([...mockData.shares, ...localShares]);
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.department) {
      toast.error('Please select department');
      return;
    }
    if (!formData.personName.trim()) {
      toast.error('Please enter person name');
      return;
    }
    if (!formData.fileName.trim()) {
      toast.error('Please enter file name or ID');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter email address');
      return;
    }
    if (!formData.mobile.trim()) {
      toast.error('Please enter mobile number');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Mobile validation (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    
    const shareMetadata = {
      shareType: isClipShare ? 'clip' : 'full',
      ...(isClipShare && clipData ? {
        clipStart: clipData.clipStart,
        clipEnd: clipData.clipEnd,
        clipDuration: clipData.clipDuration,
        tagType: clipData.tagType,
        videoId: clipData.videoId
      } : {})
    };
    
    const newShare = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      file: formData.fileName,
      metadata: shareMetadata,
      sharedAt: new Date().toISOString()
    };

    const existingShares = JSON.parse(localStorage.getItem('iprd_shares') || '[]');
    existingShares.push(newShare);
    localStorage.setItem('iprd_shares', JSON.stringify(existingShares));
    
    // Create audit log with clip info if applicable
    const logFileName = isClipShare && clipData 
      ? `${formData.fileName} [${clipData.clipStart}-${clipData.clipEnd}]`
      : formData.fileName;
    
    if (user) {
      createAuditLog('Share', logFileName, user);
    }
    
    // Clear pending share
    localStorage.removeItem('iprd_pending_share');
    
    setShares(prev => [...prev, newShare]);
    toast.success(isClipShare ? `Video clip (${clipData?.clipStart} - ${clipData?.clipEnd}) shared successfully!` : 'File shared successfully!');
    
    // Reset form
    setFormData({
      department: '',
      personName: '',
      fileName: '',
      email: '',
      mobile: '',
      remarks: ''
    });
    setIsClipShare(false);
    setClipData(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Share Content</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Share Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Share File</h2>
          
          {isClipShare && clipData && (
            <div className="mb-4 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-2">📹 Video Clip Share</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Time Range:</strong> {clipData.clipStart} - {clipData.clipEnd}</p>
                  <p><strong>Clip Duration:</strong> {clipData.clipDuration}</p>
                  <p><strong>Tag Type:</strong> {clipData.tagType}</p>
                </div>
              </div>
              
              {/* Clip Preview Mini-Player */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Clip Preview</h4>
                <div className="max-w-md">
                  <VideoPlayer
                    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    clipStart={clipData.clipStart}
                    clipEnd={clipData.clipEnd}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Preview of the selected clip time range</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {mockData.departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Person Name *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="Enter person name"
                value={formData.personName}
                onChange={(e) => handleChange('personName', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Name / ID *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="Enter file name or ID"
                value={formData.fileName}
                onChange={(e) => handleChange('fileName', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile *
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                placeholder="9876543210"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                rows="3"
                placeholder="Enter remarks..."
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-blue text-white py-3 rounded-xl hover:bg-accent transition-colors font-semibold"
            >
              Share File
            </button>
          </form>
        </div>

        {/* Past Shares Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Shares</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-700">To</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700">File</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {shares.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      No shares yet.
                    </td>
                  </tr>
                ) : (
                  shares.slice(0, 10).map((share) => (
                    <tr key={share.id || share.date} className="border-b border-gray-100">
                      <td className="py-2 text-sm text-gray-700">{share.to || share.email}</td>
                      <td className="py-2 text-sm text-gray-700">
                        {share.file || share.fileName}
                        {share.metadata?.shareType === 'clip' && (
                          <div className="text-xs text-blue-600 mt-1">
                            📹 Clip: {share.metadata.clipStart} - {share.metadata.clipEnd}
                          </div>
                        )}
                      </td>
                      <td className="py-2 text-sm">
                        {share.metadata?.shareType === 'clip' ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Video Clip
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            Full File
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-sm text-gray-600">{share.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareContent;

