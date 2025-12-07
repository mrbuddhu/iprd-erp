import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ url, onTimeUpdate, tags = [], onSeek, thumbnails = [], clipStart, clipEnd }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);
  const progressBarRef = useRef(null);

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
    if (onTimeUpdate) {
      onTimeUpdate(state.playedSeconds);
    }
    
    // Auto-stop at clip end if clip preview mode
    if (clipEnd && state.playedSeconds >= clipEnd) {
      if (playerRef.current) {
        playerRef.current.getInternalPlayer()?.pause();
      }
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

  const timeToSeconds = (timeStr) => {
    const parts = timeStr.split(':').map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };

  const getTagColor = (tagType) => {
    switch (tagType) {
      case 'CM Byte': return 'bg-red-500';
      case 'Innovation': return 'bg-blue-500';
      case 'Achievement': return 'bg-green-500';
      default: return 'bg-primary-blue';
    }
  };

  const handleSeekToTag = (tag) => {
    const startSeconds = timeToSeconds(tag.startTime || tag.start);
    if (playerRef.current) {
      playerRef.current.seekTo(startSeconds, 'seconds');
      if (onSeek) {
        onSeek(startSeconds);
      }
    }
  };

  useEffect(() => {
    // Auto-seek to clip start if in clip preview mode
    if (clipStart && playerRef.current) {
      const startSeconds = typeof clipStart === 'string' ? timeToSeconds(clipStart) : clipStart;
      playerRef.current.seekTo(startSeconds, 'seconds');
    }
  }, [clipStart]);

  useEffect(() => {
    // Auto-stop at clip end if in clip preview mode
    if (clipEnd && currentTime > 0) {
      const endSeconds = typeof clipEnd === 'string' ? timeToSeconds(clipEnd) : clipEnd;
      if (currentTime >= endSeconds && playerRef.current) {
        const internalPlayer = playerRef.current.getInternalPlayer();
        if (internalPlayer && !internalPlayer.paused) {
          internalPlayer.pause();
        }
      }
    }
  }, [currentTime, clipEnd]);

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
        playing={clipStart ? true : undefined}
      />
      
      {/* Custom Progress Bar with Tag Markers */}
      {tags && tags.length > 0 && duration > 0 && (
        <div className="bg-gray-900 px-4 py-2">
          <div className="relative h-2 bg-gray-700 rounded-full mb-2" ref={progressBarRef}>
            {/* Progress indicator */}
            <div 
              className="absolute top-0 left-0 h-full bg-primary-blue rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            {/* Tag markers */}
            {tags.map((tag, idx) => {
              const tagStart = timeToSeconds(tag.startTime || tag.start);
              const position = (tagStart / duration) * 100;
              const tagType = tag.type || tag.tagType;
              return (
                <div
                  key={idx}
                  className={`absolute top-0 h-full w-1 ${getTagColor(tagType)} cursor-pointer hover:opacity-80`}
                  style={{ left: `${position}%` }}
                  title={`${tagType}: ${tag.startTime || tag.start}`}
                  onClick={() => handleSeekToTag(tag)}
                />
              );
            })}
          </div>
        </div>
      )}
      
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between text-sm">
        <span>Current Time: {formatTime(currentTime)}</span>
        <span>Duration: {formatTime(duration)}</span>
      </div>

      {/* Video Thumbnails */}
      {thumbnails && thumbnails.length > 0 && (
        <div className="bg-gray-900 px-4 py-3">
          <h4 className="text-white text-sm font-semibold mb-2">Video Thumbnails</h4>
          <div className="flex gap-3">
            {thumbnails.map((thumb, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  if (playerRef.current && thumb.time) {
                    const seekTime = timeToSeconds(thumb.time);
                    playerRef.current.seekTo(seekTime, 'seconds');
                  }
                }}
              >
                <img
                  src={thumb.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-20 object-cover"
                />
                <div className="text-white text-xs text-center py-1">
                  {thumb.time || `${Math.floor((idx + 1) * (duration / thumbnails.length))}s`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

