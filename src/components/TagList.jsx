import React from 'react';
import { getTagColor } from '../utils/tagColors';

const TagList = ({ tags, onDeleteTag, onTagClick }) => {
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
        {tags.map((tag, index) => {
          const tagType = tag.type || tag.tagType;
          const colors = getTagColor(tagType);
          return (
            <div 
              key={index} 
              className={`border ${colors.border} rounded-lg p-4 flex justify-between items-start ${onTagClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={onTagClick ? () => onTagClick(tag) : undefined}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2 flex-wrap">
                  <span className="text-sm text-gray-600">
                    <strong>Start:</strong> {tag.startTime || tag.start}
                  </span>
                  <span className="text-sm text-gray-600">
                    <strong>End:</strong> {tag.endTime || tag.end}
                  </span>
                  <span className={`px-3 py-1 ${colors.bg} ${colors.text} text-xs rounded-full border ${colors.border}`}>
                    {tagType}
                  </span>
                </div>
                {tag.remarks && (
                  <p className="text-sm text-gray-500">{tag.remarks}</p>
                )}
              </div>
              {onDeleteTag && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTag(index);
                  }}
                  className="ml-4 text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TagList;

