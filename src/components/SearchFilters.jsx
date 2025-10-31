import React, { useState, useEffect, useRef } from 'react';
import { debounce } from '../utils/debounce';
import mockData from '../data/mockData.json';

const SearchFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    searchText: '',
    department: '',
    district: '',
    block: '',
    personTag: '',
    contentType: '',
    tagType: '',
    yearStart: '',
    yearEnd: ''
  });

  // Create debounced function ref
  const debouncedFilterChange = useRef(
    debounce((searchValue, currentFilters) => {
      const newFilters = { ...currentFilters, searchText: searchValue };
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
    }, 300)
  );

  // Update filters when search text changes (debounced)
  useEffect(() => {
    if (filters.searchText !== undefined) {
      debouncedFilterChange.current(filters.searchText, filters);
    }
  }, [filters.searchText]);

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      // For non-search fields, update immediately
      if (field !== 'searchText') {
        onFilterChange(newFilters);
      }
    }
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, searchText: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Filters</h3>
      
      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Search Content</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
          placeholder="Search by title, department, tags..."
          value={filters.searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            value={filters.department}
            onChange={(e) => handleChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            {mockData.departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            value={filters.district}
            onChange={(e) => handleChange('district', e.target.value)}
          >
            <option value="">All Districts</option>
            {mockData.districts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            value={filters.block}
            onChange={(e) => handleChange('block', e.target.value)}
          >
            <option value="">All Blocks</option>
            {mockData.blocks.map((block) => (
              <option key={block} value={block}>{block}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            value={filters.contentType}
            onChange={(e) => handleChange('contentType', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Video">Video</option>
            <option value="Photo">Photo</option>
            <option value="Report">Report</option>
            <option value="Document">Document</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tag Type</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            value={filters.tagType}
            onChange={(e) => handleChange('tagType', e.target.value)}
          >
            <option value="">All Tags</option>
            <option value="Best Practice">Best Practice</option>
            <option value="Innovation">Innovation</option>
            <option value="Achievement">Achievement</option>
            <option value="Success Story">Success Story</option>
            <option value="Testimonial">Testimonial</option>
            <option value="CM Byte">CM Byte</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Person Tag</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            placeholder="Enter person name"
            value={filters.personTag}
            onChange={(e) => handleChange('personTag', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year From</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            placeholder="YYYY"
            value={filters.yearStart}
            onChange={(e) => handleChange('yearStart', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year To</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
            placeholder="YYYY"
            value={filters.yearEnd}
            onChange={(e) => handleChange('yearEnd', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;

