import React, { useState, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import ZipViewer from '../components/ZipViewer';
import BulkActions from '../components/BulkActions';
import { useTranslations } from '../utils/translations';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonCard from '../components/SkeletonCard';
import FileTypeIcon from '../components/FileTypeIcon';
import { getTagColor } from '../utils/tagColors';
import mockData from '../data/mockData.json';

const SearchContent = () => {
  const { t } = useTranslations();
  const [results, setResults] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPresets, setSearchPresets] = useState([]);
  const itemsPerPage = 12;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      try {
        const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
        const allContent = [...mockData.videos, ...localContent];
        setResults(allContent);
        setLoading(false);
      } catch (error) {
        console.error('Error loading content:', error);
        toast.error('Error loading content');
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Load search presets
  useEffect(() => {
    try {
      const presets = JSON.parse(localStorage.getItem('iprd_search_presets') || '[]');
      setSearchPresets(presets);
    } catch (error) {
      console.error('Error loading search presets:', error);
    }
  }, []);

  // Pagination
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = results.slice(startIndex, endIndex);

  // Reset to page 1 when results change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
  }, [results.length]);

  // Get unique departments from results
  const uniqueDepartments = [...new Set(results.map(item => item.department).filter(Boolean))];

  const handleDepartmentFilter = (dept) => {
    setSelectedDepartments(prev => 
      prev.includes(dept) 
        ? prev.filter(d => d !== dept)
        : [...prev, dept]
    );
  };

  const handleExportToExcel = () => {
    // Convert results to CSV
    const headers = ['Title', 'Department', 'District', 'Block', 'Content Type', 'Upload Date', 'Tags', 'Source'];
    const csvRows = [headers.join(',')];
    
    results.forEach(item => {
      const row = [
        `"${(item.title || item.contentName || '').replace(/"/g, '""')}"`,
        `"${item.department || ''}"`,
        `"${item.district || ''}"`,
        `"${item.block || ''}"`,
        `"${item.contentType || ''}"`,
        `"${item.uploadDate || item.date || ''}"`,
        `"${(item.tags || []).map(t => t.type || t).join('; ')}"`,
        `"${item.source || 'cloud'}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `search_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Search results exported to CSV successfully!');
  };

  // HTML escape function to prevent XSS
  const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const handlePrintPreview = () => {
    if (!selectedContent) return;
    
    // Escape all user-provided data to prevent XSS
    const title = escapeHtml(selectedContent.title || selectedContent.contentName || 'Untitled');
    const department = escapeHtml(selectedContent.department || 'N/A');
    const district = escapeHtml(selectedContent.district || 'N/A');
    const block = escapeHtml(selectedContent.block || 'N/A');
    const contentType = escapeHtml(selectedContent.contentType || 'N/A');
    const uploadDate = escapeHtml(selectedContent.uploadDate || selectedContent.date || 'N/A');
    const remarks = selectedContent.remarks ? escapeHtml(selectedContent.remarks) : '';
    
    // Build tags HTML safely
    let tagsHtml = '';
    if (selectedContent.tags && selectedContent.tags.length > 0) {
      const tagsList = selectedContent.tags.map(tag => {
        const tagType = escapeHtml(tag.type || tag || '');
        const startTime = escapeHtml(tag.startTime || tag.start || '');
        const endTime = escapeHtml(tag.endTime || tag.end || '');
        return `<li>${tagType} (${startTime} - ${endTime})</li>`;
      }).join('');
      tagsHtml = `
        <div class="detail">
          <span class="label">Tags:</span>
          <ul>${tagsList}</ul>
        </div>
      `;
    }
    
    const remarksHtml = remarks ? `<div class="detail"><span class="label">Remarks:</span> ${remarks}</div>` : '';
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .detail { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="detail"><span class="label">Department:</span> ${department}</div>
          <div class="detail"><span class="label">District:</span> ${district}</div>
          <div class="detail"><span class="label">Block:</span> ${block}</div>
          <div class="detail"><span class="label">Content Type:</span> ${contentType}</div>
          <div class="detail"><span class="label">Upload Date:</span> ${uploadDate}</div>
          ${tagsHtml}
          ${remarksHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

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

    // Apply department filter chips
    if (selectedDepartments.length > 0) {
      filtered = filtered.filter(item => selectedDepartments.includes(item.department));
    }
    
    setResults(filtered);
  };

  useEffect(() => {
    // Re-filter when department chips change
    try {
      const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
      let filtered = [...mockData.videos, ...localContent];
      
      // Apply department filter if any departments are selected
      if (selectedDepartments.length > 0) {
        filtered = filtered.filter(item => selectedDepartments.includes(item.department));
      }
      // If no departments selected (cleared filters), show all results
      
      setResults(filtered);
    } catch (error) {
      console.error('Error filtering by department:', error);
      toast.error('Error applying filters');
    }
  }, [selectedDepartments]);


  const handleCloseModal = () => {
    setSelectedContent(null);
    setZipFile(null);
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedResults.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedResults.map(item => item.id));
    }
  };

  const handleBulkDelete = (items) => {
    try {
      const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
      const itemIds = items.map(item => item.id);
      const filtered = localContent.filter(item => !itemIds.includes(item.id));
      localStorage.setItem('iprd_content', JSON.stringify(filtered));
      setResults(prev => prev.filter(item => !itemIds.includes(item.id)));
      toast.success(`Deleted ${items.length} items`);
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error('Error deleting items');
    }
  };

  const handleBulkTag = (items, tagType) => {
    try {
      const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
      const itemIds = items.map(item => item.id);
      const updated = localContent.map(item => {
        if (itemIds.includes(item.id)) {
          const existingTags = item.tags || [];
          return {
            ...item,
            tags: [...existingTags, { type: tagType, startTime: '00:00:00', endTime: '00:00:00' }]
          };
        }
        return item;
      });
      localStorage.setItem('iprd_content', JSON.stringify(updated));
      setResults(prev => prev.map(item => {
        if (itemIds.includes(item.id)) {
          const existingTags = item.tags || [];
          return { ...item, tags: [...existingTags, { type: tagType }] };
        }
        return item;
      }));
    } catch (error) {
      console.error('Error tagging items:', error);
      toast.error('Error tagging items');
    }
  };

  const handleSaveSearchPreset = () => {
    const presetName = prompt('Enter a name for this search preset:');
    if (presetName && presetName.trim()) {
      try {
        const newPreset = {
          id: Date.now(),
          name: presetName.trim(),
          filters: { /* current filters */ },
          resultCount: results.length,
          createdAt: new Date().toISOString()
        };
        const updated = [...searchPresets, newPreset].slice(-10); // Keep last 10
        localStorage.setItem('iprd_search_presets', JSON.stringify(updated));
        setSearchPresets(updated);
        toast.success('Search preset saved!');
      } catch (error) {
        console.error('Error saving preset:', error);
        toast.error('Error saving preset');
      }
    }
  };

  // Track view count
  const handleContentClick = async (content) => {
    // Increment view count
    try {
      const viewCounts = JSON.parse(localStorage.getItem('iprd_view_counts') || '{}');
      viewCounts[content.id] = (viewCounts[content.id] || 0) + 1;
      localStorage.setItem('iprd_view_counts', JSON.stringify(viewCounts));
    } catch (error) {
      console.error('Error tracking view:', error);
    }

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
      if (content.metadata?.zipFileList) {
        setSelectedContent(content);
        setZipFile(null);
      } else {
        toast.info('ZIP file viewer requires the file. Please re-upload the ZIP file to view/extract contents. Tip: ZIP files can be viewed and extracted when uploaded.', { duration: 5000 });
        setSelectedContent(content);
        setZipFile(null);
      }
    } else {
      setSelectedContent(content);
      setZipFile(null);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="w-full -mx-4 lg:-mx-6 px-4 lg:px-6 py-4 lg:py-6 bg-white border-b border-gray-200 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{t('searchContent.title')}</h1>
      </div>
      
      <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
        <SearchFilters onFilterChange={handleFilterChange} />
        <div className="flex gap-2">
          {searchPresets.length > 0 && (
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              onChange={(e) => {
                if (e.target.value) {
                  toast.info('Loading preset...');
                }
              }}
            >
              <option value="">{t('searchContent.savedSearches')}</option>
              {searchPresets.map(preset => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} ({preset.resultCount} results)
                </option>
              ))}
            </select>
          )}
          <button
            onClick={handleSaveSearchPreset}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
          >
            {t('searchContent.saveSearch')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
            <p className="text-gray-600">
              {t('searchContent.foundResults', { count: results.length, plural: results.length !== 1 ? 's' : '' })}
            </p>
            {results.length > 0 && (
              <button
                onClick={handleExportToExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                📊 {t('searchContent.exportToExcel')}
              </button>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <BulkActions
              selectedItems={results.filter(item => selectedItems.includes(item.id))}
              onBulkDelete={handleBulkDelete}
              onBulkTag={handleBulkTag}
              onClearSelection={() => setSelectedItems([])}
              itemType="items"
            />
          )}

          {/* Department Filter Chips */}
          {uniqueDepartments.length > 0 && (
            <div className="mb-4 bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('searchContent.filterByDepartment')}</h3>
              <div className="flex flex-wrap gap-2">
                {uniqueDepartments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => handleDepartmentFilter(dept)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedDepartments.includes(dept)
                        ? 'bg-primary-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
                {selectedDepartments.length > 0 && (
                  <button
                    onClick={() => setSelectedDepartments([])}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    {t('searchContent.clearFilters')}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedItems.length === paginatedResults.length && paginatedResults.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-primary-blue rounded"
              />
              <span className="text-sm text-gray-600">{t('searchContent.selectAll')}</span>
            </div>
            <div className="text-sm text-gray-600">
              {t('searchContent.showing', { start: startIndex + 1, end: Math.min(endIndex, results.length), total: results.length })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedResults.map((content) => {
          const viewCounts = JSON.parse(localStorage.getItem('iprd_view_counts') || '{}');
          const viewCount = viewCounts[content.id] || 0;
          return (
          <div
            key={content.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-2">
              <input
                type="checkbox"
                checked={selectedItems.includes(content.id)}
                onChange={() => handleItemSelect(content.id)}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 w-4 h-4 text-primary-blue rounded"
              />
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => handleContentClick(content)}
              >
                <div className="flex items-center gap-3">
                  <FileTypeIcon contentType={content.contentType} />
                  <h3 className="text-lg font-semibold text-gray-800 flex-1">
                    {content.title || content.contentName}
                  </h3>
                </div>
              </div>
            </div>
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
                {content.tags.slice(0, 3).map((tag, idx) => {
                  const tagType = tag.type || tag;
                  const colors = getTagColor(tagType);
                  return (
                    <span key={idx} className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded-full border ${colors.border}`}>
                      {tagType}
                    </span>
                  );
                })}
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
              {viewCount > 0 && (
                <span className="text-xs text-gray-500">👁️ {viewCount} views</span>
              )}
            </div>
          </div>
        )})}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('searchContent.previous')}
              </button>
              <span className="px-4 py-2 text-gray-700">
                {t('searchContent.page', { current: currentPage, total: totalPages })}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('searchContent.next')}
              </button>
            </div>
          )}
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
              <div className="flex items-center gap-3">
                <FileTypeIcon contentType={selectedContent.contentType} className="text-3xl" />
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedContent.title || selectedContent.contentName}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPreview}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm flex items-center gap-2"
                >
                  🖨️ Print Preview
                </button>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
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
                    {selectedContent.tags.map((tag, idx) => {
                      const tagType = tag.type || tag;
                      const colors = getTagColor(tagType);
                      return (
                        <div key={idx} className={`border ${colors.border} rounded p-2`}>
                          <span className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded-full mr-2`}>
                            {tagType}
                          </span>
                          <span className="text-sm text-gray-600">
                            {tag.startTime || tag.start} - {tag.endTime || tag.end}
                          </span>
                          {tag.remarks && (
                            <p className="text-sm text-gray-500 mt-1">{tag.remarks}</p>
                          )}
                        </div>
                      );
                    })}
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

