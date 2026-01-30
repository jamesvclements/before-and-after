/**
 * Browser automation via agent-browser CLI.
 * Requires agent-browser to be installed globally.
 */

import { execSync } from 'child_process';
import { ViewportSize } from './types.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

function exec(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    const err = error as { stderr?: string; message?: string };
    throw new Error(err.stderr || err.message || 'Command failed');
  }
}

export interface ScreenshotOptions {
  viewport: ViewportSize;
  fullPage?: boolean;
  selector?: string;
}

/**
 * Capture a screenshot using agent-browser CLI.
 * Returns the screenshot as a Buffer.
 */
export async function captureScreenshot(
  url: string,
  options: ScreenshotOptions
): Promise<Buffer> {
  // Set viewport
  exec(`agent-browser set viewport ${options.viewport.width} ${options.viewport.height}`);

  // Navigate to URL
  exec(`agent-browser open "${url}"`);

  // Wait for page to settle (fonts, JS rendering)
  exec('agent-browser wait 500');

  // If selector specified, scroll it into view
  if (options.selector) {
    try {
      exec(`agent-browser scrollintoview "${options.selector}"`);
      exec('agent-browser wait 200');
    } catch {
      throw new Error(`Element not found: ${options.selector}`);
    }
  }

  // Take screenshot to temp file
  const tempFile = path.join(os.tmpdir(), `screenshot-${Date.now()}.png`);
  const fullFlag = options.fullPage ? '--full' : '';
  exec(`agent-browser screenshot ${fullFlag} "${tempFile}"`);

  // Read and return buffer
  const buffer = fs.readFileSync(tempFile);
  fs.unlinkSync(tempFile);

  return buffer;
}

/**
 * Close the browser session.
 */
export function closeBrowser(): void {
  try {
    exec('agent-browser close');
  } catch {
    // Ignore errors if browser wasn't open
  }
}
