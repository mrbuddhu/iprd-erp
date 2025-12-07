import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useKeyboardShortcuts = (options = {}) => {
  const navigate = useNavigate();
  const {
    onUpload,
    onSearch,
    onClose,
    disabled = false
  } = options;

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (onSearch) {
          onSearch();
        } else {
          navigate('/search');
          toast.success('🔍 Search activated!');
        }
      }

      // Ctrl+U or Cmd+U for upload
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        if (onUpload) {
          onUpload();
        } else {
          navigate('/add-content');
          toast.success('📤 Upload page opened!');
        }
      }

      // Esc to close modals
      if (e.key === 'Escape' && onClose) {
        onClose();
      }

      // Ctrl+/ or Cmd+/ for help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        navigate('/help');
        toast.success('❓ Help Center opened!');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onUpload, onSearch, onClose, disabled]);
};

