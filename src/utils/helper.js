export const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * Get initials from a name (up to 2 letters)
 */
export const getInitials = (name = '') => {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
};

/**
 * Extract YouTube embed URL from any YouTube link
 */
export const getYouTubeEmbed = (url) => {
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /\/shorts\/([^?]+)/,
    /\/embed\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
};

/**
 * Check if the current user has hearted something
 */
export const hasHearted = (hearts = [], userId) => {
  return hearts.some(id => id === userId || id?._id === userId);
};