// Generate fake thumbnails for videos
export const generateThumbnails = (duration, count = 3) => {
  if (!duration || duration <= 0) {
    // Return placeholder thumbnails if duration not available
    return Array.from({ length: count }, (_, i) => ({
      url: `https://via.placeholder.com/320x180/4A5568/FFFFFF?text=Thumbnail+${i + 1}`,
      time: formatTime((i + 1) * 10)
    }));
  }

  const thumbnails = [];
  const interval = duration / (count + 1);
  
  for (let i = 1; i <= count; i++) {
    const time = interval * i;
    thumbnails.push({
      url: `https://via.placeholder.com/320x180/4A5568/FFFFFF?text=Thumbnail+${i}`,
      time: formatTime(time)
    });
  }
  
  return thumbnails;
};

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

