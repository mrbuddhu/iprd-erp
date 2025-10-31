import React from 'react';
import ComingSoon from '../components/ComingSoon';

const HelpCenter = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Help Center</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Support</h2>
        <div className="space-y-4">
          <div>
            <strong className="text-gray-700">Support Email:</strong>
            <p className="text-gray-600">support@sanganakhq.com</p>
          </div>
          <div>
            <strong className="text-gray-700">Support Hours:</strong>
            <p className="text-gray-600">Monday - Friday, 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>

      <ComingSoon message="User Guide Coming Soon" />
    </div>
  );
};

export default HelpCenter;

