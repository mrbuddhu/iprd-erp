import React from 'react';

const FileTypeIcon = ({ contentType, className = "text-2xl" }) => {
  const getIcon = () => {
    switch (contentType) {
      case 'Video':
        return '🎬';
      case 'Photo':
        return '🖼️';
      case 'Document':
        return '📄';
      case 'Report':
        return '📊';
      default:
        return '📁';
    }
  };

  return <span className={className}>{getIcon()}</span>;
};

export default FileTypeIcon;

