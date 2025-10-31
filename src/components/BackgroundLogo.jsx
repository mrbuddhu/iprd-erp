import React from 'react';

const BackgroundLogo = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        backgroundImage: 'url(/bihar-logo-red.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '120px auto',
        opacity: 0.08,
        filter: 'grayscale(100%)',
        mixBlendMode: 'multiply',
        backgroundPosition: '0 0'
      }}
      aria-hidden="true"
    >
    </div>
  );
};

export default BackgroundLogo;

