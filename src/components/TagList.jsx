import React from 'react';

const TagList = ({ tags, onDeleteTag }) => {
  if (!tags || tags.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
        <p className="text-gray-500">No tags added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tags ({tags.length} added ✅)
      </h3>
      <div className="space-y-3">
        {tags.map((tag, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm text-gray-600">
                  <strong>Start:</strong> {tag.startTime}
                </span>
                <span className="text-sm text-gray-600">
                  <strong>End:</strong> {tag.endTime}
                </span>
                <span className="px-3 py-1 bg-primary-blue text-white text-xs rounded-full">
                  {tag.tagType}
                </span>
              </div>
              {tag.remarks && (
                <p className="text-sm text-gray-500">{tag.remarks}</p>
              )}
            </div>
            {onDeleteTag && (
              <button
                onClick={() => onDeleteTag(index)}
                className="ml-4 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagList;

