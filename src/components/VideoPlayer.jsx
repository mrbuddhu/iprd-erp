import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ url, onTimeUpdate }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
    if (onTimeUpdate) {
      onTimeUpdate(state.playedSeconds);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="bg-black rounded-xl overflow-hidden">
      <ReactPlayer
        ref={playerRef}
        url={url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
        width="100%"
        height="450px"
        controls
        onProgress={handleProgress}
        onDuration={handleDuration}
      />
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between text-sm">
        <span>Current Time: {formatTime(currentTime)}</span>
        <span>Duration: {formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default VideoPlayer;

