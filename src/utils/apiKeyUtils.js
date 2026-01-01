/**
 * Utility functions for API key operations
 */

/**
 * Generates a new API key with the format sk_xxxxxxxxxxxxxx
 * @returns {string} A randomly generated API key
 */
export const generateApiKey = () => {
  return `sk_${Math.random().toString(36).substring(2, 15)}${Math.random()
    .toString(36)
    .substring(2, 15)}`;
};

/**
 * Masks an API key showing only the first 4 characters
 * @param {string} key - The API key to mask
 * @returns {string} Masked API key
 */
export const maskApiKey = (key) => {
  if (key.length <= 4) return key;
  const prefix = key.substring(0, 4);
  return `${prefix}-${"*".repeat(13)}`;
};

/**
 * Formats an API key for display (converts sk_ prefix to api-)
 * @param {string} key - The API key to format
 * @returns {string} Formatted API key
 */
export const formatApiKey = (key) => {
  // Format like api-*************
  if (key.startsWith("sk_")) {
    return key.replace("sk_", "api-");
  }
  return key;
};
