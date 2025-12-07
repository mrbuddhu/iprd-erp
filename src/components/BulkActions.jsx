import React from 'react';
import toast from 'react-hot-toast';

const BulkActions = ({ selectedItems, onBulkDelete, onBulkTag, onClearSelection, itemType = 'items' }) => {
  if (selectedItems.length === 0) return null;

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} ${itemType}?`)) {
      if (onBulkDelete) {
        onBulkDelete(selectedItems);
        toast.success(`Deleted ${selectedItems.length} ${itemType}`);
      }
      if (onClearSelection) {
        onClearSelection();
      }
    }
  };

  const handleBulkTag = () => {
    const tagType = prompt('Enter tag type for all selected items:');
    if (tagType && tagType.trim()) {
      if (onBulkTag) {
        onBulkTag(selectedItems, tagType.trim());
        toast.success(`Tagged ${selectedItems.length} ${itemType} with "${tagType}"`);
      }
      if (onClearSelection) {
        onClearSelection();
      }
    }
  };

  return (
    <div className="bg-primary-blue text-white rounded-lg p-4 mb-4 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <span className="font-semibold">
          {selectedItems.length} {itemType} selected
        </span>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleBulkTag}
          className="bg-white text-primary-blue px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
        >
          🏷️ Bulk Tag
        </button>
        <button
          onClick={handleBulkDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          🗑️ Delete Selected
        </button>
        <button
          onClick={onClearSelection}
          className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium"
        >
          ✕ Clear Selection
        </button>
      </div>
    </div>
  );
};

export default BulkActions;

