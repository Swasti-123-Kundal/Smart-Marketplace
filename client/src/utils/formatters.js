/**
 * Formats a number to Indian Rupees (INR) format
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a Date to a clean localized format
 * @param {string|Date} dateVal
 * @returns {string}
 */
export const formatDate = (dateVal) => {
  if (!dateVal) return '';
  return new Date(dateVal).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Returns distance of a date to now (e.g. "2 hrs ago", "Just now")
 * @param {string|Date} dateVal
 * @returns {string}
 */
export const formatDistanceToNow = (dateVal) => {
  if (!dateVal) return '';
  const now = new Date();
  const past = new Date(dateVal);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;

  return formatDate(dateVal);
};

/**
 * Truncates text with trailing ellipsis
 * @param {string} text
 * @param {number} limit
 * @returns {string}
 */
export const truncateText = (text, limit = 100) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '...';
};
