import React, { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import TagForm from '../components/TagForm';
import TagList from '../components/TagList';
import toast from 'react-hot-toast';
import mockData from '../data/mockData.json';

const VideoLibrary = () => {
  const [phase, setPhase] = useState('all'); // raw, editing, output, all
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [tags, setTags] = useState([]);
  const [shareModal, setShareModal] = useState({ open: false, video: null });
  const [contentFilter, setContentFilter] = useState('all'); // all, video, photo, document, report
  
  // Get all content from localStorage or use mock data
  const getAllContent = () => {
    const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
    const allContent = [...mockData.videos, ...localContent];
    return allContent;
  };

  // Filter videos for video-specific phases
  const getVideos = () => {
    const allContent = getAllContent();
    return allContent.filter(v => v.contentType === 'Video');
  };

  const rawVideos = getVideos().filter(v => v.status === 'Raw' || !v.status);
  const finalVideos = getVideos().filter(v => v.status === 'Final');
  
  // Get all content (for general library view)
  const allContent = getAllContent();
  const editingVideo = selectedVideo;

  const handleSendToEditing = (video) => {
    setSelectedVideo(video);
    setPhase('editing');
    setTags(video.tags || []);
  };

  const handleAddTag = (tag) => {
    setTags(prev => [...prev, tag]);
  };

  const handleDeleteTag = (index) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveTags = () => {
    // Update video with tags
    const localVideos = JSON.parse(localStorage.getItem('iprd_content') || '[]');
    const updatedVideo = { ...selectedVideo, tags, status: 'Final' };
    
    const updatedVideos = localVideos.map(v => 
      v.id === selectedVideo.id ? updatedVideo : v
    );
    localStorage.setItem('iprd_content', JSON.stringify(updatedVideos));
    
    toast.success('Video tags saved! Moving to Output phase.');
    setPhase('output');
    setSelectedVideo(null);
    setTags([]);
  };

  const handleShareClip = (video, tag) => {
    // Navigate to share page with clip information
    const shareData = {
      fileName: video.title || video.contentName,
      clipStart: tag.startTime,
      clipEnd: tag.endTime,
      tagType: tag.type,
      videoId: video.id,
      clipDuration: calculateClipDuration(tag.startTime, tag.endTime)
    };
    
    // Store clip share data in localStorage
    localStorage.setItem('iprd_pending_share', JSON.stringify(shareData));
    
    // Redirect to share page or show success
          toast.success(`Clip ${tag.startTime}-${tag.endTime} ready for sharing. Please use Share Content page to complete.`);
    setShareModal({ open: false, video: null });
  };

  // Helper function to calculate clip duration
  const calculateClipDuration = (start, end) => {
    const startParts = start.split(':').map(Number);
    const endParts = end.split(':').map(Number);
    
    const startSeconds = startParts[0] * 3600 + startParts[1] * 60 + startParts[2];
    const endSeconds = endParts[0] * 3600 + endParts[1] * 60 + endParts[2];
    const durationSeconds = endSeconds - startSeconds;
    
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const openShareModal = (video) => {
    setShareModal({ open: true, video });
  };

  const closeShareModal = () => {
    setShareModal({ open: false, video: null });
  };

  // Phase I: Raw File Upload / Content Library
  if (phase === 'raw') {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Library - Raw Videos</h1>
            <p className="text-gray-600 mt-1">Videos pending editing</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPhase('all')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              📁 View All Content
            </button>
            <button
              onClick={() => setPhase('output')}
              className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              View Final Videos
            </button>
          </div>
        </div>

        <div className="mb-4 bg-white rounded-xl shadow-sm p-4">
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setPhase('raw')}
              className="px-4 py-2 font-medium text-sm border-b-2 border-primary-blue text-primary-blue"
            >
              🎬 Videos (Raw) - {rawVideos.length}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">S.No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Department</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Size</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rawVideos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No raw videos uploaded yet.
                    </td>
                  </tr>
                ) : (
                  rawVideos.map((video, index) => (
                    <tr key={video.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{video.title || video.contentName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{video.department}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {video.metadata?.formattedDuration || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {video.fileSizeFormatted || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Raw
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleSendToEditing(video)}
                          className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                        >
                          Send to Editing
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Phase II: Editor Processing
  if (phase === 'editing' && editingVideo) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Library - Video Editor Processing</h1>
          <button
            onClick={() => {
              setPhase('raw');
              setSelectedVideo(null);
              setTags([]);
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Library
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Editing: {editingVideo.title || editingVideo.contentName}
          </h2>
          <VideoPlayer 
            url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
            onTimeUpdate={setCurrentTime}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TagForm currentTime={currentTime} onAddTag={handleAddTag} />
          <TagList tags={tags} onDeleteTag={handleDeleteTag} />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setPhase('raw');
              setSelectedVideo(null);
              setTags([]);
            }}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-400 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTags}
            className="bg-primary-blue text-white px-6 py-3 rounded-xl hover:bg-accent transition-colors font-semibold"
          >
            Save & Move to Output
          </button>
        </div>
      </div>
    );
  }

  // Phase: All Content Library View (Default View)
  if (phase === 'all') {
    const filteredContent = contentFilter === 'all' 
      ? allContent 
      : allContent.filter(item => item.contentType === contentFilter);
    
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Library</h1>
            <p className="text-gray-600 mt-1">Access all uploaded content: Videos, Images, Documents, Reports, ZIP files</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPhase('raw')}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              🎬 Raw Videos
            </button>
            <button
              onClick={() => setPhase('output')}
              className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              View Final Videos
            </button>
          </div>
        </div>

        {/* Content Type Filter */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setContentFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                contentFilter === 'all'
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📁 All ({allContent.length})
            </button>
            <button
              onClick={() => setContentFilter('Video')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                contentFilter === 'Video'
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎬 Videos ({allContent.filter(c => c.contentType === 'Video').length})
            </button>
            <button
              onClick={() => setContentFilter('Photo')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                contentFilter === 'Photo'
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🖼️ Photos ({allContent.filter(c => c.contentType === 'Photo').length})
            </button>
            <button
              onClick={() => setContentFilter('Document')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                contentFilter === 'Document'
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📄 Documents ({allContent.filter(c => c.contentType === 'Document').length})
            </button>
            <button
              onClick={() => setContentFilter('Report')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                contentFilter === 'Report'
                  ? 'bg-primary-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Reports ({allContent.filter(c => c.contentType === 'Report').length})
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-500">No {contentFilter === 'all' ? '' : contentFilter.toLowerCase()} content available yet.</p>
              </div>
            </div>
          ) : (
            filteredContent.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                {/* Content Type Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">
                    {item.contentType === 'Video' ? '🎬' :
                     item.contentType === 'Photo' ? '🖼️' :
                     item.contentType === 'Document' ? '📄' :
                     item.contentType === 'Report' ? '📊' : '📁'}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.metadata?.isZip && (
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        📦 ZIP
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'Final' ? 'bg-green-100 text-green-800' :
                      item.status === 'Raw' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status || 'Final'}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {item.title || item.contentName}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{item.department}</p>
                
                {/* Metadata */}
                <div className="text-xs text-gray-500 mb-3 space-y-1">
                  {item.metadata?.formattedDuration && (
                    <p>⏱️ {item.metadata.formattedDuration}</p>
                  )}
                  {item.fileSizeFormatted && (
                    <p>📦 {item.fileSizeFormatted}</p>
                  )}
                  {item.metadata?.width && item.metadata?.height && (
                    <p>📐 {item.metadata.width}x{item.metadata.height}</p>
                  )}
                  {item.metadata?.fileExtension && (
                    <p>📎 {item.metadata.fileExtension.toUpperCase()}</p>
                  )}
                  {item.metadata?.isZip && item.metadata?.zipFileCount && (
                    <p>📦 {item.metadata.zipFileCount} files inside</p>
                  )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-primary-blue text-white text-xs rounded">
                          {tag.type || tag}
                        </span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-4">
                  {item.contentType === 'Video' && item.status === 'Raw' && (
                    <button
                      onClick={() => {
                        setSelectedVideo(item);
                        setPhase('editing');
                        setTags(item.tags || []);
                      }}
                      className="w-full bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                    >
                      Send to Video Editing
                    </button>
                  )}
                  {item.contentType === 'Video' && item.status === 'Final' && item.tags && item.tags.length > 0 && (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm">
                        View
                      </button>
                      <button
                        onClick={() => openShareModal(item)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Share
                      </button>
                    </div>
                  )}
                  {(item.contentType !== 'Video' || item.status !== 'Raw') && (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm">
                        👁️ View
                      </button>
                      <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                        📤 Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Phase III: Output Uploads
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Library - Final Videos</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setPhase('raw')}
            className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            View Raw Videos
          </button>
          <button
            onClick={() => setPhase('all')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            📁 View All Content
          </button>
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
            Bulk Upload – Coming Soon
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalVideos.length === 0 ? (
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500">No final videos available yet.</p>
            </div>
          </div>
        ) : (
          finalVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {video.title || video.contentName}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{video.department}</p>
              
              {/* Metadata */}
              <div className="text-xs text-gray-500 mb-3 space-y-1">
                {video.metadata?.formattedDuration && (
                  <p>⏱️ Duration: {video.metadata.formattedDuration}</p>
                )}
                {video.fileSizeFormatted && (
                  <p>📦 Size: {video.fileSizeFormatted}</p>
                )}
                {video.metadata?.width && video.metadata?.height && (
                  <p>📐 Resolution: {video.metadata.width}x{video.metadata.height}</p>
                )}
              </div>
              
              {video.tags && video.tags.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary-blue text-white text-xs rounded">
                        {tag.type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button className="flex-1 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm">
                  View Clip
                </button>
                {video.tags && video.tags.length > 0 && (
                  <button
                    onClick={() => openShareModal(video)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Share Clip
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Share Modal */}
      {shareModal.open && shareModal.video && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Share Clip</h3>
            <select
              id="tagSelect"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
            >
              {shareModal.video.tags.map((tag, idx) => (
                <option key={idx} value={idx}>
                  {tag.type} ({tag.startTime} - {tag.endTime})
                </option>
              ))}
            </select>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const idx = document.getElementById('tagSelect').value;
                  handleShareClip(shareModal.video, shareModal.video.tags[idx]);
                }}
                className="flex-1 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                Share
              </button>
              <button
                onClick={closeShareModal}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLibrary;

