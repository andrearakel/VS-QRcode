const STORAGE_KEY = 'vs_analytics';

export const logEvent = (productId, category, depth = 0) => {
  const event = {
    productId,
    category,
    depth,
    timestamp: Date.now(),
    url: window.location.pathname,
  };

  const logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  logs.push(event);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};

export const getLogs = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

export const clearLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const exportLogs = () => {
  const logs = getLogs();
  const blob = new Blob([JSON.stringify(logs, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vs-analytics-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};