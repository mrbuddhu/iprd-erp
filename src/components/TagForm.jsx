import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const TagForm = ({ currentTime, onAddTag }) => {
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    tagType: '',
    remarks: ''
  });

  useEffect(() => {
    if (currentTime) {
      const formattedTime = formatTime(currentTime);
      setFormData(prev => ({ ...prev, startTime: formattedTime }));
    }
  }, [currentTime]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.startTime && formData.endTime && formData.tagType) {
      onAddTag({ ...formData });
      setFormData({
        startTime: formatTime(currentTime || 0),
        endTime: '',
        tagType: '',
        remarks: ''
      });
    } else {
      toast.error('Please fill in Start Time, End Time, and Tag Type');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Tag</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="00:00:00"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="00:00:00"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tag Type</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            value={formData.tagType}
            onChange={(e) => handleChange('tagType', e.target.value)}
          >
            <option value="">Select Tag Type</option>
            <option value="Best Practice">Best Practice</option>
            <option value="Innovation">Innovation</option>
            <option value="Achievement">Achievement</option>
            <option value="Success Story">Success Story</option>
            <option value="Testimonial">Testimonial</option>
            <option value="CM Byte">CM Byte</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
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
          className="w-full bg-primary-blue text-white py-2 rounded-xl hover:bg-accent transition-colors font-medium"
        >
          Add Tag
        </button>
      </form>
    </div>
  );
};

export default TagForm;

