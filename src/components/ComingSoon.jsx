import React from 'react';

const ComingSoon = ({ message = 'This feature is coming soon!' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-sm p-8">
      <div className="text-6xl mb-4">🚧</div>
      <h3 className="text-2xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default ComingSoon;

