// Utility function to create audit logs
export const createAuditLog = (action, fileName, user) => {
  const log = {
    id: Date.now(),
    user: user.username || 'Unknown',
    action: action,
    file: fileName || 'N/A',
    date: new Date().toLocaleString('en-IN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }),
    ip: '192.168.1.' + Math.floor(Math.random() * 255) // Mock IP since no backend
  };

  // Save to localStorage
  const existingLogs = JSON.parse(localStorage.getItem('iprd_audit_logs') || '[]');
  existingLogs.push(log);
  localStorage.setItem('iprd_audit_logs', JSON.stringify(existingLogs));

  return log;
};

