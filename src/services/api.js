/**
 * API Service Layer
 * 
 * This is a mock API service that can be easily replaced with real backend calls.
 * For production, replace localStorage calls with actual API endpoints.
 * 
 * Example real implementation:
 * const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
 * 
 * export const searchContent = async (filters, page = 1, limit = 50) => {
 *   const response = await fetch(`${API_BASE}/content?${new URLSearchParams({...filters, page, limit})}`);
 *   return response.json();
 * };
 */

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
export const apiService = {
  // Content Operations
  content: {
    // Search content with filters and pagination
    search: async (filters = {}, page = 1, limit = 50) => {
      await delay(300); // Simulate network delay
      
      try {
        const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
        const mockData = await import('../data/mockData.json');
        const allContent = [...mockData.default.videos, ...localContent];
        
        // Apply filters (mock - in real API, backend handles this)
        let filtered = allContent;
        
        if (filters.department) {
          filtered = filtered.filter(item => item.department === filters.department);
        }
        if (filters.contentType) {
          filtered = filtered.filter(item => item.contentType === filters.contentType);
        }
        if (filters.searchText) {
          const search = filters.searchText.toLowerCase();
          filtered = filtered.filter(item => 
            (item.title || item.contentName || '').toLowerCase().includes(search) ||
            (item.department || '').toLowerCase().includes(search)
          );
        }
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginated = filtered.slice(startIndex, endIndex);
        
        return {
          data: paginated,
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit)
        };
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    
    // Get single content item
    getById: async (id) => {
      await delay(200);
      
      try {
        const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
        const mockData = await import('../data/mockData.json');
        const allContent = [...mockData.default.videos, ...localContent];
        return allContent.find(item => item.id === id) || null;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    
    // Upload new content
    upload: async (formData) => {
      await delay(1000); // Simulate upload time
      
      try {
        const existingData = JSON.parse(localStorage.getItem('iprd_content') || '[]');
        const newContent = {
          id: Date.now(),
          ...formData,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        
        existingData.push(newContent);
        localStorage.setItem('iprd_content', JSON.stringify(existingData));
        
        return { success: true, data: newContent };
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    
    // Delete content
    delete: async (id) => {
      await delay(300);
      
      try {
        const existingData = JSON.parse(localStorage.getItem('iprd_content') || '[]');
        const filtered = existingData.filter(item => item.id !== id);
        localStorage.setItem('iprd_content', JSON.stringify(filtered));
        
        return { success: true };
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    
    // Bulk operations
    bulkDelete: async (ids) => {
      await delay(500);
      
      try {
        const existingData = JSON.parse(localStorage.getItem('iprd_content') || '[]');
        const filtered = existingData.filter(item => !ids.includes(item.id));
        localStorage.setItem('iprd_content', JSON.stringify(filtered));
        
        return { success: true, deleted: ids.length };
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  },
  
  // Analytics
  analytics: {
    getDashboard: async () => {
      await delay(400);
      
      try {
        const localContent = JSON.parse(localStorage.getItem('iprd_content') || '[]');
        const localShares = JSON.parse(localStorage.getItem('iprd_shares') || '[]');
        const mockData = await import('../data/mockData.json');
        
        return {
          totalUploads: localContent.length + mockData.default.videos.length,
          totalSearches: parseInt(localStorage.getItem('iprd_search_count') || '0'),
          totalShares: localShares.length + mockData.default.shares.length,
          // ... other stats
        };
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  },
  
  // Search presets
  presets: {
    getAll: async () => {
      await delay(200);
      try {
        return JSON.parse(localStorage.getItem('iprd_search_presets') || '[]');
      } catch (error) {
        return [];
      }
    },
    
    save: async (preset) => {
      await delay(200);
      try {
        const presets = JSON.parse(localStorage.getItem('iprd_search_presets') || '[]');
        presets.push(preset);
        localStorage.setItem('iprd_search_presets', JSON.stringify(presets));
        return { success: true };
      } catch (error) {
        throw error;
      }
    }
  }
};

/**
 * REAL API IMPLEMENTATION EXAMPLE:
 * 
 * Uncomment and modify this when you have a real backend:
 * 
 * const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
 * 
 * export const apiService = {
 *   content: {
 *     search: async (filters, page = 1, limit = 50) => {
 *       const params = new URLSearchParams({
 *         page,
 *         limit,
 *         ...filters
 *       });
 *       const response = await fetch(`${API_BASE}/content?${params}`);
 *       if (!response.ok) throw new Error('Search failed');
 *       return response.json();
 *     },
 *     
 *     upload: async (formData) => {
 *       const response = await fetch(`${API_BASE}/content`, {
 *         method: 'POST',
 *         body: formData,
 *         headers: {
 *           'Authorization': `Bearer ${getAuthToken()}`
 *         }
 *       });
 *       if (!response.ok) throw new Error('Upload failed');
 *       return response.json();
 *     }
 *   }
 * };
 */

