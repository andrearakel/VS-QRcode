const STORAGE_KEY = 'vs_analytics';
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxvuikTCbai6H_yXQi_iB05b7K7p5Wg8i4SY7GDdu-QULKDZFR7Gl6IG91OVVjix2NSQw/exec';

// Generate a session ID so we can group events per visitor
function getSessionId() {
  let sessionId = sessionStorage.getItem('vs_session');
  if (!sessionId) {
    sessionId = 'ses-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    sessionStorage.setItem('vs_session', sessionId);
  }
  return sessionId;
}

export function logEvent(productId, category, depth) {
  const event = {
    productId,
    category,
    depth,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    sessionId: getSessionId()
  };

  // Save locally (backup)
  const logs = getLogs();
  logs.push(event);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

  // Send to Google Sheets
  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  }).catch(err => console.warn('Sheet sync failed:', err));

  return event;
}

export function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function clearLogs() {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportLogs() {
  const logs = getLogs();
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vs-analytics-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}