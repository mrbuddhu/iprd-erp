// Comprehensive file format support
export const FILE_FORMATS = {
  video: {
    extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v', '3gp', 'ogv', 'ogm', 'mpeg', 'mpg', 'vob', 'ts', 'm2ts', 'mts', 'asf', 'rm', 'rmvb', 'divx', 'xvid', 'f4v', 'amv'],
    mimeTypes: ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/webm', 'video/x-matroska', 'video/3gpp', 'video/ogg', 'video/mpeg']
  },
  image: {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'tif', 'ico', 'heic', 'heif', 'raw', 'cr2', 'nef', 'orf', 'sr2', 'dng', 'arw', 'rw2', 'raf', 'srw', 'x3f', 'mrw', 'pef', 'kdc', 'dcr', 'psd', 'ai', 'eps', 'sketch', 'fig'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml', 'image/tiff', 'image/x-icon', 'image/heic', 'image/heif']
  },
  document: {
    extensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp', 'csv', 'pages', 'numbers', 'key', 'md', 'tex', 'latex', 'wps', 'wpd', 'wks', 'wdb'],
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain', 'application/rtf', 'application/vnd.oasis.opendocument.text', 'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.presentation', 'text/csv']
  },
  archive: {
    extensions: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'cab', 'iso', 'dmg', 'pkg', 'deb', 'rpm', 'apk'],
    mimeTypes: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'application/x-tar', 'application/gzip', 'application/x-bzip2']
  }
};

// Detect file type from extension
export const detectFileType = (fileName) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  if (!ext) return 'Unknown';
  
  if (FILE_FORMATS.video.extensions.includes(ext)) return 'Video';
  if (FILE_FORMATS.image.extensions.includes(ext)) return 'Photo';
  if (FILE_FORMATS.document.extensions.includes(ext)) return 'Document';
  if (FILE_FORMATS.archive.extensions.includes(ext)) return 'Archive';
  
  return 'Other';
};

// Check if file is video
export const isVideoFile = (fileName) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return FILE_FORMATS.video.extensions.includes(ext || '');
};

// Check if file is image
export const isImageFile = (fileName) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return FILE_FORMATS.image.extensions.includes(ext || '');
};

// Get all supported extensions as string for accept attribute
export const getAllSupportedExtensions = () => {
  const all = [
    ...FILE_FORMATS.video.extensions,
    ...FILE_FORMATS.image.extensions,
    ...FILE_FORMATS.document.extensions,
    ...FILE_FORMATS.archive.extensions
  ];
  return all.map(ext => `.${ext}`).join(',');
};

