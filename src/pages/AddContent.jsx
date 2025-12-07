import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createAuditLog } from '../utils/auditLog';
import { isVideoFile, isImageFile, detectFileType, FILE_FORMATS } from '../utils/fileFormats';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import DragDropUpload from '../components/DragDropUpload';
import mockData from '../data/mockData.json';
import { generateThumbnails } from '../utils/thumbnailGenerator';

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const AddContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    contentName: '',
    department: '',
    personTag: '',
    district: '',
    block: '',
    contentType: '',
    remarks: '',
    source: 'cloud', // Default to cloud
    file: null
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target?.files?.[0] || e; // Support both event and direct file
    if (file) {
      const metadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileExtension: file.name.split('.').pop()?.toLowerCase(),
        lastModified: new Date(file.lastModified).toISOString(),
        duration: null, // Will be set for videos
        width: null,
        height: null
      };

      // Auto-detect content type if not set
      const detectedType = detectFileType(file.name);
      if (!formData.contentType) {
        let contentType = 'Document';
        if (detectedType === 'Video') contentType = 'Video';
        else if (detectedType === 'Photo') contentType = 'Photo';
        else if (detectedType === 'Document') contentType = 'Document';
        else if (detectedType === 'Report') contentType = 'Report';
        
        setFormData(prev => ({ ...prev, contentType }));
      }

      // Extract ZIP metadata if it's a ZIP file
      if (file.name.toLowerCase().endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
        metadata.isZip = true;
        // Try to read ZIP contents
        import('jszip').then(JSZip => {
          const zip = new JSZip.default();
          zip.loadAsync(file).then(zipData => {
            const fileList = [];
            zipData.forEach((relativePath, zipEntry) => {
              if (!zipEntry.dir) {
                fileList.push({
                  name: zipEntry.name,
                  size: zipEntry._data?.uncompressedSize || 0
                });
              }
            });
            metadata.zipFileList = fileList;
            metadata.zipFileCount = fileList.length;
            setFormData(prev => ({ ...prev, file, metadata }));
          }).catch(err => {
            console.error('Error reading ZIP:', err);
            metadata.isZip = true;
            setFormData(prev => ({ ...prev, file, metadata }));
          });
        }).catch(() => {
          metadata.isZip = true;
          setFormData(prev => ({ ...prev, file, metadata }));
        });
      }
      // Extract video metadata if it's a video file
      else if (file.type.startsWith('video/') || isVideoFile(file.name)) {
        try {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.src = URL.createObjectURL(file);
          
          video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            metadata.duration = video.duration; // Duration in seconds
            metadata.width = video.videoWidth;
            metadata.height = video.videoHeight;
            setFormData(prev => ({ ...prev, file, metadata }));
          };
          
          video.onerror = () => {
            window.URL.revokeObjectURL(video.src);
            setFormData(prev => ({ ...prev, file, metadata }));
          };
        } catch (error) {
          console.error('Error extracting video metadata:', error);
          setFormData(prev => ({ ...prev, file, metadata }));
        }
      } 
      // Extract image metadata if it's an image file
      else if (file.type.startsWith('image/') || isImageFile(file.name)) {
        try {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          
          img.onload = () => {
            window.URL.revokeObjectURL(img.src);
            metadata.width = img.naturalWidth;
            metadata.height = img.naturalHeight;
            setFormData(prev => ({ ...prev, file, metadata }));
          };
          
          img.onerror = () => {
            window.URL.revokeObjectURL(img.src);
            setFormData(prev => ({ ...prev, file, metadata }));
          };
        } catch (error) {
          console.error('Error extracting image metadata:', error);
          setFormData(prev => ({ ...prev, file, metadata }));
        }
      } 
      // For documents, just set metadata
      else {
        setFormData(prev => ({ ...prev, file, metadata }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.contentName.trim()) {
      toast.error('Please enter content name');
      return;
    }
    if (!formData.department) {
      toast.error('Please select department');
      return;
    }
    if (!formData.contentType) {
      toast.error('Please select content type');
      return;
    }
    if (!formData.file) {
      toast.error('Please select a file to upload');
      return;
    }

    // File size validation (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (formData.file.size > maxSize) {
      toast.error('File size must be less than 100MB');
      return;
    }

    setUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage with metadata
      const existingData = JSON.parse(localStorage.getItem('iprd_content') || '[]');
      const metadata = formData.metadata || {};
      
      // Format duration for videos
      if (metadata.duration) {
        const hours = Math.floor(metadata.duration / 3600);
        const minutes = Math.floor((metadata.duration % 3600) / 60);
        const seconds = Math.floor(metadata.duration % 60);
        metadata.formattedDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Generate thumbnails for videos
        if (formData.contentType === 'Video') {
          metadata.thumbnails = generateThumbnails(metadata.duration, 3);
        }
      }
      
      // Format image dimensions if available
      if (metadata.width && metadata.height) {
        metadata.formattedDimensions = `${metadata.width}x${metadata.height}`;
      }
      
      const newContent = {
        id: Date.now(),
        ...formData,
        metadata: {
          ...metadata,
          uploadedBy: user?.username || 'Unknown',
          uploadedAt: new Date().toISOString()
        },
        uploadDate: new Date().toISOString().split('T')[0],
        uploadDateTime: new Date().toISOString(),
        status: formData.contentType === 'Video' ? 'Raw' : 'Final',
        fileSizeFormatted: formatFileSize(metadata.fileSize || 0)
      };
      existingData.push(newContent);
      localStorage.setItem('iprd_content', JSON.stringify(existingData));

      // Create audit log
      if (user) {
        createAuditLog('Upload', formData.contentName, user);
      }

      setUploading(false);
      toast.success('Content uploaded successfully!');
      
      // If video, redirect to library
      if (formData.contentType === 'Video') {
        navigate('/video-library');
      } else {
        // Reset form
        setFormData({
          contentName: '',
          department: '',
          personTag: '',
          district: '',
          block: '',
          contentType: '',
          remarks: '',
          source: 'cloud',
          file: null,
          metadata: {}
        });
      }
    } catch (error) {
      console.error('Error uploading content:', error);
      setUploading(false);
      toast.error('Error uploading content. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Content</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File * <span className="text-xs text-gray-500">(or drag & drop)</span>
            </label>
            <DragDropUpload
              onFileSelect={handleFileChange}
              accept="video/*,image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp,.csv,.zip,.rar,.7z,.tar,.gz,.bz2,.xz,.pages,.numbers,.key,.md,.tex"
              maxSize={100 * 1024 * 1024}
            >
              <div className="p-8 text-center cursor-pointer">
                {formData.file ? (
                  <div className="space-y-2">
                    <div className="text-4xl">✅</div>
                    <div className="font-semibold text-gray-700">{formData.metadata?.fileName || 'File selected'}</div>
                    <div className="text-sm text-gray-500">Click or drag another file to replace</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-4xl">📤</div>
                    <div className="font-semibold text-gray-700">Drag & drop file here</div>
                    <div className="text-sm text-gray-500">or click to browse</div>
                    <div className="text-xs text-gray-400 mt-2">Supports: Videos, Images, Documents, Archives</div>
                  </div>
                )}
              </div>
            </DragDropUpload>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleFileChange({ target: { files: [e.target.files[0]] } });
                }
              }}
              accept="video/*,image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp,.csv,.zip,.rar,.7z,.tar,.gz,.bz2,.xz,.pages,.numbers,.key,.md,.tex"
              required
            />
            <div className="text-xs text-gray-500 mt-2 p-3 bg-gray-50 rounded-lg">
              <strong className="block mb-2">📁 Supported Formats (All Major Formats):</strong>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <strong>🎬 Videos:</strong><br/>
                  MP4, AVI, MOV, WMV, FLV, WebM, MKV, M4V, 3GP, OGV, OGM, MPEG, MPG, VOB, TS, M2TS, MTS, ASF, RM, RMVB, DIVX, XVID, F4V, AMV
                </div>
                <div>
                  <strong>🖼️ Images:</strong><br/>
                  JPG, JPEG, PNG, GIF, BMP, WebP, SVG, TIFF, TIF, ICO, HEIC, HEIF, RAW, CR2, NEF, ORF, SR2, DNG, ARW, RW2, RAF, SRW, X3F, MRW, PEF, KDC, DCR, PSD, AI, EPS
                </div>
                <div>
                  <strong>📄 Documents:</strong><br/>
                  PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF, ODT, ODS, ODP, CSV, PAGES, NUMBERS, KEY, MD, TEX, WPS, WPD
                </div>
                <div>
                  <strong>📦 Archives:</strong><br/>
                  ZIP, RAR, 7Z, TAR, GZ, BZ2, XZ, CAB, ISO, DMG, PKG, DEB, RPM, APK
                </div>
              </div>
            </div>
            {formData.metadata && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg text-xs">
                <p><strong>Selected File:</strong> {formData.metadata.fileName}</p>
                <p><strong>Size:</strong> {formatFileSize(formData.metadata.fileSize)}</p>
                <p><strong>Type:</strong> {formData.metadata.fileType || formData.metadata.fileExtension?.toUpperCase()}</p>
                {formData.metadata.isZip && (
                  <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                    <p><strong>📦 ZIP Archive Detected</strong></p>
                    {formData.metadata.zipFileCount !== undefined && (
                      <p><strong>Files inside:</strong> {formData.metadata.zipFileCount}</p>
                    )}
                    {formData.metadata.zipFileList && formData.metadata.zipFileList.length > 0 && (
                      <div className="mt-1 max-h-20 overflow-y-auto">
                        <p className="text-xs font-semibold mb-1">Contents:</p>
                        <ul className="text-xs space-y-0.5">
                          {formData.metadata.zipFileList.slice(0, 5).map((f, idx) => (
                            <li key={idx}>• {f.name}</li>
                          ))}
                          {formData.metadata.zipFileList.length > 5 && (
                            <li className="text-purple-600">... and {formData.metadata.zipFileList.length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                    <p className="text-xs text-purple-700 mt-2">
                      💡 You can view and extract files from this ZIP after upload in Search Content page
                    </p>
                  </div>
                )}
                {formData.metadata.duration && (
                  <p><strong>Duration:</strong> {formData.metadata.formattedDuration || 'Extracting...'}</p>
                )}
                {formData.metadata.width && formData.metadata.height && (
                  <p><strong>Dimensions:</strong> {formData.metadata.width}x{formData.metadata.height}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Name *
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="Enter content name"
              value={formData.contentName}
              onChange={(e) => handleChange('contentName', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {mockData.departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                value={formData.contentType}
                onChange={(e) => handleChange('contentType', e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="Video">Video</option>
                <option value="Photo">Photo</option>
                <option value="Report">Report</option>
                <option value="Document">Document</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Person Tag
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="Enter person tag"
              value={formData.personTag}
              onChange={(e) => handleChange('personTag', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
              >
                <option value="">Select District</option>
                {mockData.districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Block
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                value={formData.block}
                onChange={(e) => handleChange('block', e.target.value)}
              >
                <option value="">Select Block</option>
                {mockData.blocks.map((block) => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage Source *
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              value={formData.source}
              onChange={(e) => handleChange('source', e.target.value)}
              required
            >
              <option value="cloud">Cloud Storage</option>
              <option value="local">Local Storage (Office Network Only)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-blue"
              rows="4"
              placeholder="Enter remarks..."
              value={formData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
            />
          </div>

          {/* OCR Extract Text Button for Documents */}
          {formData.contentType === 'Document' && formData.file && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">📄 OCR Extract Text</h4>
                  <p className="text-xs text-blue-600">Extract text from scanned documents and images</p>
                </div>
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 bg-blue-200 text-blue-800 rounded-lg text-sm font-medium cursor-not-allowed opacity-75"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          )}

                 <button
                   type="submit"
                   disabled={uploading}
                   className="w-full bg-primary-blue text-white py-3 rounded-xl hover:bg-accent transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                   {uploading ? (
                     <>
                       <LoadingSpinner size="sm" />
                       <span>Uploading...</span>
                     </>
                   ) : (
                     'Upload Content'
                   )}
                 </button>
        </form>
      </div>
    </div>
  );
};

export default AddContent;

