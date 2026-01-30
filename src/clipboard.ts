/**
 * Cross-platform clipboard utilities
 */

import { execSync } from 'child_process';

/**
 * Copy text to system clipboard
 * Supports macOS (pbcopy) and Linux (xclip)
 */
export function copyToClipboard(text: string): boolean {
  try {
    if (process.platform === 'darwin') {
      execSync('pbcopy', { input: text });
      return true;
    } else if (process.platform === 'linux') {
      execSync('xclip -selection clipboard', { input: text });
      return true;
    }
    // Windows or unsupported platform
    return false;
  } catch {
    return false;
  }
}
