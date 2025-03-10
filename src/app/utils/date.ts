/**
 * Formats a timestamp into a human-readable date string.
 * @param {number} timestamp - The timestamp in milliseconds.
 * @returns {string} The formatted date string.
 */
export function formatTimestamp(timestamp: number): string {
  const now: Date = new Date();
  const date: Date = new Date(timestamp);

  if (now.toDateString() === date.toDateString()) {
    return formatDate(date, { hour: 'numeric', minute: '2-digit' });
  } else if (
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()
  ) {
    return formatDate(date, { weekday: 'long' });
  } else if (now.getFullYear() === date.getFullYear()) {
    return formatDate(date, { month: 'short', day: 'numeric' });
  } else {
    return formatDate(date, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

/**
 * Formats a date object into a string based on the provided options.
 * @param {Date} date - The date object to format.
 * @param {Intl.DateTimeFormatOptions} options - The options for formatting the date.
 * @returns {string} The formatted date string.
 */
function formatDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
