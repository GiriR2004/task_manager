/**
 * Formats a date string into a more readable format
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "Jan 15, 2025")
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Determines if a due date is in the past
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {boolean} Whether the date is in the past
 */
export const isDatePast = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};
