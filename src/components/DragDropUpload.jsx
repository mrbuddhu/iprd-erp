import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

const DragDropUpload = ({ onFileSelect, accept, maxSize = 100 * 1024 * 1024, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    const file = files[0]; // For now, handle single file
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${(maxSize / (1024 * 1024)).toFixed(0)}MB`);
      return;
    }
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`relative border-2 border-dashed rounded-xl transition-all ${
        isDragging
          ? 'border-primary-blue bg-blue-50 scale-105'
          : 'border-gray-300 hover:border-primary-blue hover:bg-gray-50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />
      {isDragging && (
        <div className="absolute inset-0 bg-primary-blue bg-opacity-10 flex items-center justify-center z-10 rounded-xl">
          <div className="text-center">
            <div className="text-4xl mb-2">📤</div>
            <div className="text-primary-blue font-semibold">Drop file here to upload</div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default DragDropUpload;

