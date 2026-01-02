/**
 * Utility functions for clipboard operations
 */

/**
 * Copies text to clipboard with fallback support
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function copyToClipboard(text) {
  try {
    // Use modern Clipboard API (works on HTTPS and localhost)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Clipboard API not available - show prompt for manual copy
      const userCopied = prompt(
        "Copy this API key (Select all and press Ctrl+C):",
        text
      );
      return userCopied !== null;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    // Show prompt as fallback
    const userCopied = prompt(
      "Copy this API key (Select all and press Ctrl+C):",
      text
    );
    return userCopied !== null;
  }
}
