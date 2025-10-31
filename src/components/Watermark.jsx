import React from 'react';

const Watermark = () => {
  return (
    <div 
      className="fixed bottom-2 right-2 lg:bottom-4 lg:right-4 pointer-events-none z-20 text-[8px] sm:text-[10px] text-gray-500 uppercase font-medium tracking-wide select-none"
      style={{
        opacity: 0.55,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
      aria-hidden="true"
    >
      <span className="hidden sm:inline">Government of Bihar Prototype – Confidential</span>
      <span className="sm:hidden">GoB Prototype – Confidential</span>
    </div>
  );
};

export default Watermark;
