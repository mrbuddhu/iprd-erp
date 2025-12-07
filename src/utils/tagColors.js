// Utility for tag category colors
export const getTagColor = (tagType) => {
  switch (tagType) {
    case 'CM Byte':
      return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', solid: 'bg-red-500' };
    case 'Innovation':
      return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', solid: 'bg-blue-500' };
    case 'Achievement':
      return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', solid: 'bg-green-500' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', solid: 'bg-primary-blue' };
  }
};

export const getTagBadge = (tagType, className = '') => {
  const colors = getTagColor(tagType);
  return (
    <span className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs rounded-full border ${colors.border} ${className}`}>
      {tagType}
    </span>
  );
};

