import React, { useState, useEffect } from 'react';
import ComingSoon from '../components/ComingSoon';
import toast from 'react-hot-toast';
import mockData from '../data/mockData.json';

const MasterSettings = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItemName, setNewItemName] = useState('');

  const tabs = [
    { id: 'departments', label: 'Departments', storageKey: 'iprd_departments' },
    { id: 'districts', label: 'Districts', storageKey: 'iprd_districts' },
    { id: 'blocks', label: 'Blocks', storageKey: 'iprd_blocks' },
    { id: 'roles', label: 'Roles', storageKey: 'iprd_roles' },
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  // Load items from localStorage or use mock data
  useEffect(() => {
    const stored = localStorage.getItem(currentTab.storageKey);
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      // Initialize with mock data
      const defaultData = {
        departments: mockData.departments,
        districts: mockData.districts,
        blocks: mockData.blocks,
        roles: mockData.roles
      };
      setItems(defaultData[activeTab] || []);
      localStorage.setItem(currentTab.storageKey, JSON.stringify(defaultData[activeTab] || []));
    }
  }, [activeTab, currentTab]);

  const handleAdd = () => {
    if (!newItemName.trim()) {
      toast.error('Please enter a name');
      return;
    }
    if (items.includes(newItemName.trim())) {
      toast.error('This item already exists');
      return;
    }
    const updated = [...items, newItemName.trim()];
    setItems(updated);
    localStorage.setItem(currentTab.storageKey, JSON.stringify(updated));
    setNewItemName('');
    setShowAddModal(false);
    toast.success(`${currentTab.label.slice(0, -1)} added successfully!`);
  };

  const handleEdit = (item, index) => {
    setEditingItem({ name: item, index });
    setNewItemName(item);
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!newItemName.trim()) {
      toast.error('Please enter a name');
      return;
    }
    if (items.includes(newItemName.trim()) && editingItem.name !== newItemName.trim()) {
      toast.error('This item already exists');
      return;
    }
    const updated = [...items];
    updated[editingItem.index] = newItemName.trim();
    setItems(updated);
    localStorage.setItem(currentTab.storageKey, JSON.stringify(updated));
    setNewItemName('');
    setShowEditModal(false);
    setEditingItem(null);
    toast.success(`${currentTab.label.slice(0, -1)} updated successfully!`);
  };

  const handleDelete = (index) => {
    if (window.confirm(`Are you sure you want to delete "${items[index]}"?`)) {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
      localStorage.setItem(currentTab.storageKey, JSON.stringify(updated));
      toast.success(`${currentTab.label.slice(0, -1)} deleted successfully!`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Master Settings</h1>
      
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-blue text-primary-blue'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{currentTab.label}</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            + Add New
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">S.No</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-500">
                    No {currentTab.label.toLowerCase()} found. Click "+ Add New" to create one.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{item}</td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleEdit(item, index)}
                        className="text-primary-blue hover:text-accent text-sm font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New {currentTab.label.slice(0, -1)}</h3>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue mb-4"
              placeholder={`Enter ${currentTab.label.slice(0, -1).toLowerCase()} name`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewItemName('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit {currentTab.label.slice(0, -1)}</h3>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue mb-4"
              placeholder={`Enter ${currentTab.label.slice(0, -1).toLowerCase()} name`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                  setNewItemName('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Banner */}
      <div className="mt-6">
        <ComingSoon message="Advanced Mapping features coming soon!" />
      </div>
    </div>
  );
};

export default MasterSettings;

