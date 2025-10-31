import React, { useState, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import ZipViewer from '../components/ZipViewer';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonCard from '../components/SkeletonCard';
import mockData from '../data/mockData.json';

const SearchContent = () => {
  const [results, setResults] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
      const allContent = [...mockData.videos, ...localContent];
      setResults(allContent);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (newFilters) => {
    const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
    let filtered = [...mockData.videos, ...localContent];

    // Text search (debounced)
    if (newFilters.searchText && newFilters.searchText.trim()) {
      const searchLower = newFilters.searchText.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const title = (item.title || item.contentName || '').toLowerCase();
        const dept = (item.department || '').toLowerCase();
        const person = (item.personTag || '').toLowerCase();
        const tags = (item.tags || []).map(t => (t.type || t || '').toLowerCase()).join(' ');
        
        return title.includes(searchLower) || 
               dept.includes(searchLower) || 
               person.includes(searchLower) ||
               tags.includes(searchLower);
      });
    }

    if (newFilters.department) {
      filtered = filtered.filter(item => item.department === newFilters.department);
    }
    if (newFilters.district) {
      filtered = filtered.filter(item => item.district === newFilters.district);
    }
    if (newFilters.block) {
      filtered = filtered.filter(item => item.block === newFilters.block);
    }
    if (newFilters.contentType) {
      filtered = filtered.filter(item => item.contentType === newFilters.contentType);
    }
    if (newFilters.personTag) {
      filtered = filtered.filter(item =>
        item.personTag && item.personTag.toLowerCase().includes(newFilters.personTag.toLowerCase())
      );
    }
    if (newFilters.tagType) {
      filtered = filtered.filter(item => {
        if (!item.tags || !Array.isArray(item.tags)) return false;
        return item.tags.some(tag => {
          const tagType = tag.type || tag;
          return tagType === newFilters.tagType;
        });
      });
    }
    if (newFilters.yearStart) {
      filtered = filtered.filter(item => {
        const year = new Date(item.uploadDate || item.date || 0).getFullYear();
        return year >= parseInt(newFilters.yearStart);
      });
    }
    if (newFilters.yearEnd) {
      filtered = filtered.filter(item => {
        const year = new Date(item.uploadDate || item.date || 0).getFullYear();
        return year <= parseInt(newFilters.yearEnd);
      });
    }

    // Track search
    const searchCount = parseInt(localStorage.getItem('iprd_search_count') || '0') + 1;
    localStorage.setItem('iprd_search_count', searchCount.toString());

    setResults(filtered);
  };

  const handleContentClick = async (content) => {
    const isGovtNetwork = window.location.hostname.includes('gov');
    if (content.source === 'local' && !isGovtNetwork) {
      toast.error('This file is viewable only within office network.');
      return;
    }
    
    // Check if it's a ZIP file
    const isZip = content.metadata?.isZip || 
                  content.metadata?.fileExtension === 'zip' ||
                  (content.title || content.contentName || '').toLowerCase().endsWith('.zip');
    
    if (isZip) {
      // For ZIP files, we need the actual file object
      // Since we can't store File objects in localStorage, we'll show a message
      // or allow user to re-upload ZIP for viewing
      if (content.metadata?.zipFileList) {
        // Show ZIP contents from metadata
        setSelectedContent(content);
        setZipFile(null);
      } else {
        // Try to load from localStorage or prompt for file
        toast.info('ZIP file viewer requires the file. Please re-upload the ZIP file to view/extract contents. Tip: ZIP files can be viewed and extracted when uploaded.', { duration: 5000 });
        setSelectedContent(content);
        setZipFile(null);
      }
    } else {
      setSelectedContent(content);
      setZipFile(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedContent(null);
    setZipFile(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Content</h1>
      
      <SearchFilters onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((content) => (
          <div
            key={content.id}
            onClick={() => handleContentClick(content)}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {content.title || content.contentName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">Department: {content.department}</p>
            
            {/* Metadata Display */}
            {content.metadata && (
              <div className="text-xs text-gray-500 mb-2 space-y-1">
                {content.metadata.formattedDuration && (
                  <p>⏱️ Duration: {content.metadata.formattedDuration}</p>
                )}
                {content.fileSizeFormatted && (
                  <p>📦 Size: {content.fileSizeFormatted}</p>
                )}
                {content.metadata.width && content.metadata.height && (
                  <p>
                    {content.contentType === 'Video' || content.contentType === 'Photo' ? '📐' : '📄'}
                    {content.contentType === 'Video' ? ' Resolution' : content.contentType === 'Photo' ? ' Dimensions' : ' Size'}: {content.metadata.width}x{content.metadata.height}
                  </p>
                )}
                {content.metadata.fileExtension && (
                  <p>📎 Format: {content.metadata.fileExtension.toUpperCase()}</p>
                )}
              </div>
            )}
            
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {content.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-primary-blue text-white text-xs rounded">
                    {tag.type || tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  content.source === 'cloud' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {content.source === 'cloud' ? 'Cloud' : 'Local'}
                </span>
                {(content.metadata?.isZip || content.metadata?.fileExtension === 'zip') && (
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                    📦 ZIP Archive
                  </span>
                )}
              </div>
              {content.uploadDate && (
                <span className="text-xs text-gray-500">{content.uploadDate}</span>
              )}
            </div>
          </div>
        ))}
          </div>
        </>
      )}

      {/* ZIP Viewer Modal */}
      {zipFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                📦 ZIP Archive: {selectedContent?.title || selectedContent?.contentName || 'Archive'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <ZipViewer file={zipFile} fileName={selectedContent?.title || selectedContent?.contentName} />
          </div>
        </div>
      )}

      {/* Content Details Modal */}
      {selectedContent && !zipFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedContent.title || selectedContent.contentName}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <strong className="text-gray-700">Department:</strong> {selectedContent.department}
              </div>
              {selectedContent.district && (
                <div>
                  <strong className="text-gray-700">District:</strong> {selectedContent.district}
                </div>
              )}
              {selectedContent.block && (
                <div>
                  <strong className="text-gray-700">Block:</strong> {selectedContent.block}
                </div>
              )}
              {selectedContent.contentType && (
                <div>
                  <strong className="text-gray-700">Content Type:</strong> {selectedContent.contentType}
                </div>
              )}
              {selectedContent.personTag && (
                <div>
                  <strong className="text-gray-700">Person Tag:</strong> {selectedContent.personTag}
                </div>
              )}
              {selectedContent.tags && selectedContent.tags.length > 0 && (
                <div>
                  <strong className="text-gray-700">Tags:</strong>
                  <div className="mt-2 space-y-2">
                    {selectedContent.tags.map((tag, idx) => (
                      <div key={idx} className="border border-gray-200 rounded p-2">
                        <span className="px-2 py-1 bg-primary-blue text-white text-xs rounded mr-2">
                          {tag.type}
                        </span>
                        <span className="text-sm text-gray-600">
                          {tag.startTime} - {tag.endTime}
                        </span>
                        {tag.remarks && (
                          <p className="text-sm text-gray-500 mt-1">{tag.remarks}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedContent.remarks && (
                <div>
                  <strong className="text-gray-700">Remarks:</strong>
                  <p className="text-gray-600">{selectedContent.remarks}</p>
                </div>
              )}
              
              {/* ZIP File Contents */}
              {selectedContent.metadata?.isZip && selectedContent.metadata?.zipFileList && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mt-4">
                  <strong className="text-gray-700 block mb-3">📦 ZIP Archive Contents ({selectedContent.metadata.zipFileCount} files):</strong>
                  <div className="max-h-40 overflow-y-auto">
                    <ul className="space-y-1 text-sm">
                      {selectedContent.metadata.zipFileList.map((zipFile, idx) => (
                        <li key={idx} className="flex justify-between items-center py-1 px-2 hover:bg-purple-100 rounded">
                          <span className="text-gray-700">📄 {zipFile.name}</span>
                          <span className="text-xs text-gray-500">
                            {zipFile.size ? `${(zipFile.size / 1024).toFixed(2)} KB` : 'Size unknown'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-purple-700 mt-3">
                    💡 <strong>Note:</strong> To extract individual files, please upload the ZIP file again and use the extraction feature.
                  </p>
                </div>
              )}

              {/* Detailed Metadata */}
              {selectedContent.metadata && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <strong className="text-gray-700 block mb-2">📊 Metadata:</strong>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedContent.metadata.formattedDuration && (
                      <div>
                        <strong>Duration:</strong> {selectedContent.metadata.formattedDuration}
                      </div>
                    )}
                    {selectedContent.fileSizeFormatted && (
                      <div>
                        <strong>File Size:</strong> {selectedContent.fileSizeFormatted}
                      </div>
                    )}
                    {selectedContent.metadata.width && selectedContent.metadata.height && (
                      <div>
                        <strong>Resolution:</strong> {selectedContent.metadata.width}x{selectedContent.metadata.height}
                      </div>
                    )}
                    {selectedContent.metadata.fileType && (
                      <div>
                        <strong>File Type:</strong> {selectedContent.metadata.fileType}
                      </div>
                    )}
                    {selectedContent.metadata.uploadedBy && (
                      <div>
                        <strong>Uploaded By:</strong> {selectedContent.metadata.uploadedBy}
                      </div>
                    )}
                    {selectedContent.metadata.uploadedAt && (
                      <div>
                        <strong>Uploaded At:</strong> {new Date(selectedContent.metadata.uploadedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchContent;

