/**
 * Parse kickoff date string to JavaScript Date object safely,
 * defaulting to GMT+7 (+07:00) if no timezone is provided.
 * 
 * @param {string} kickoffStr - Date string from API (e.g. "2026-07-01 18:30:00")
 * @returns {Date} JavaScript Date object
 */
export function parseKickoffDate(kickoffStr) {
  if (!kickoffStr) return new Date();

  // If it's already an ISO string with Z or has offset information (e.g. +07:00, -05:00)
  if (kickoffStr.includes("Z") || /[\+\-]\d{2}:?\d{2}$/.test(kickoffStr)) {
    return new Date(kickoffStr);
  }

  // Handle standard "YYYY-MM-DD HH:mm:ss" format by replacing space with "T"
  const formattedStr = kickoffStr.replace(" ", "T");

  // If T is missing after replace, fall back to browser parsing
  if (!formattedStr.includes("T")) {
    return new Date(formattedStr);
  }

  // Force GMT+7 (+07:00) zone
  return new Date(`${formattedStr}+07:00`);
}
