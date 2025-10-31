import React from 'react';

const SkeletonTable = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
      <div className="space-y-3">
        {/* Table Header */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
          ))}
        </div>
        {/* Table Rows */}
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="grid gap-4 border-b border-gray-100 pb-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, colIdx) => (
              <div key={colIdx} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable;

