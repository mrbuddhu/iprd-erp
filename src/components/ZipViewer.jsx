import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import toast from 'react-hot-toast';

const ZipViewer = ({ file, fileName }) => {
  const [zipContents, setZipContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  useEffect(() => {
    if (file) {
      loadZipContents();
    }
  }, [file]);

  const loadZipContents = async () => {
    try {
      setLoading(true);
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);
      
      const contents = [];
      zipData.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir) {
          contents.push({
            name: zipEntry.name,
            size: zipEntry._data?.uncompressedSize || 0,
            compressedSize: zipEntry._data?.compressedSize || 0,
            date: zipEntry.date,
            extension: zipEntry.name.split('.').pop()?.toLowerCase() || 'unknown'
          });
        }
      });
      
      setZipContents(contents.sort((a, b) => a.name.localeCompare(b.name)));
      setLoading(false);
    } catch (err) {
      console.error('Error reading ZIP file:', err);
      setError('Unable to read ZIP file. File may be corrupted or not a valid ZIP archive.');
      setLoading(false);
    }
  };

  const handleExtractFile = async (fileEntry) => {
    try {
      const zip = new JSZip();
      await zip.loadAsync(file);
      const fileData = await zip.file(fileEntry.name)?.async('blob');
      
      if (fileData) {
        const url = URL.createObjectURL(fileData);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileEntry.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`File ${fileEntry.name} extracted successfully!`);
      }
    } catch (err) {
      console.error('Error extracting file:', err);
      toast.error('Error extracting file. Please try again.');
    }
  };

  const handleViewFile = async (fileEntry) => {
    try {
      const zip = new JSZip();
      await zip.loadAsync(file);
      const fileData = await zip.file(fileEntry.name);
      
      if (!fileData) {
        toast.error('File not found in archive.');
        return;
      }

      // Read file based on type
      const extension = fileEntry.extension;
      let content = null;
      let contentType = 'text';

      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
        const blob = await fileData.async('blob');
        content = URL.createObjectURL(blob);
        contentType = 'image';
      } else if (['txt', 'md', 'csv', 'json', 'xml', 'html', 'css', 'js'].includes(extension)) {
        content = await fileData.async('text');
        contentType = 'text';
      } else if (extension === 'pdf') {
        const blob = await fileData.async('blob');
        content = URL.createObjectURL(blob);
        contentType = 'pdf';
      } else {
        content = await fileData.async('text');
        contentType = 'text';
      }

      setSelectedFile(fileEntry);
      setFileContent({ content, contentType });
    } catch (err) {
      console.error('Error viewing file:', err);
      toast.error('Error viewing file. File may be binary or unsupported format.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">📦 Reading ZIP file contents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-sm text-red-700">❌ {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">📦 ZIP Archive Contents</h3>
          <span className="text-xs text-gray-500">{zipContents.length} files</span>
        </div>
        
        {zipContents.length === 0 ? (
          <p className="text-sm text-gray-500">No files found in this archive.</p>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">File Name</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-gray-700">Size</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {zipContents.map((fileEntry, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-700 text-xs">
                      {fileEntry.name}
                      <span className="ml-2 text-gray-400">.{fileEntry.extension}</span>
                    </td>
                    <td className="py-2 px-3 text-right text-gray-600 text-xs">
                      {formatFileSize(fileEntry.size)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewFile(fileEntry)}
                          className="text-xs bg-primary-blue text-white px-2 py-1 rounded hover:bg-accent transition-colors"
                          title="View file"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => handleExtractFile(fileEntry)}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                          title="Extract file"
                        >
                          ⬇️ Extract
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* File Viewer Modal */}
      {selectedFile && fileContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{selectedFile.name}</h3>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setFileContent(null);
                  if (fileContent.contentType === 'image' || fileContent.contentType === 'pdf') {
                    URL.revokeObjectURL(fileContent.content);
                  }
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="mt-4">
              {fileContent.contentType === 'image' && (
                <img src={fileContent.content} alt={selectedFile.name} className="max-w-full h-auto" />
              )}
              {fileContent.contentType === 'pdf' && (
                <iframe
                  src={fileContent.content}
                  className="w-full h-96 border"
                  title={selectedFile.name}
                />
              )}
              {fileContent.contentType === 'text' && (
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {fileContent.content}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZipViewer;

