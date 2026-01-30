export * from './types.js';
export { resolveViewport } from './viewport.js';
export { captureScreenshot, captureBeforeAfter } from './capture.js';
export { generateFilename } from './filename.js';
export { closeBrowser } from './browser.js';

import fs from 'fs';
import path from 'path';
import {
  BeforeAndAfterOptions,
  CaptureOptions,
  CaptureResult,
  BeforeAfterCaptureOptions,
  BeforeAfterCaptureResult,
  ViewportSize,
  FromImagesOptions,
  FromImagesResult,
  ImageInput,
} from './types.js';

import { resolveViewport } from './viewport.js';
import { captureScreenshot, captureBeforeAfter } from './capture.js';

export class BeforeAndAfter {
  private options: BeforeAndAfterOptions;

  constructor(options: BeforeAndAfterOptions = {}) {
    this.options = options;
  }

  get viewport(): ViewportSize {
    return resolveViewport(this.options.viewport);
  }

  async capture(options: CaptureOptions): Promise<CaptureResult> {
    return captureScreenshot({
      viewport: this.options.viewport,
      ...options,
    });
  }

  async captureBeforeAfter(options: BeforeAfterCaptureOptions): Promise<BeforeAfterCaptureResult> {
    return captureBeforeAfter({
      viewport: this.options.viewport,
      ...options,
    });
  }

  /**
   * Create output from existing images (no browser capture needed).
   * Outputs GitHub-flavored markdown table.
   */
  async fromImages(options: FromImagesOptions): Promise<FromImagesResult> {
    const beforeImage = this.resolveImageInput(options.before);
    const afterImage = this.resolveImageInput(options.after);

    const beforeLabel = options.labels?.before || 'Before';
    const afterLabel = options.labels?.after || 'After';
    const markdown = this.generateMarkdown(beforeLabel, afterLabel, options.before, options.after);

    return {
      markdown,
      beforeImage,
      afterImage,
    };
  }

  /**
   * Generate GitHub-flavored markdown table for before/after images.
   */
  generateMarkdown(
    beforeLabel: string,
    afterLabel: string,
    beforePath: ImageInput,
    afterPath: ImageInput,
  ): string {
    // For markdown, we use the path if it's a string, otherwise a placeholder
    const beforeSrc = typeof beforePath === 'string' ? beforePath : 'before.png';
    const afterSrc = typeof afterPath === 'string' ? afterPath : 'after.png';

    return [
      `| ${beforeLabel} | ${afterLabel} |`,
      `|:------:|:-----:|`,
      `| ![${beforeLabel}](${beforeSrc}) | ![${afterLabel}](${afterSrc}) |`,
    ].join('\n');
  }

  private resolveImageInput(input: ImageInput): Buffer {
    if (Buffer.isBuffer(input)) {
      return input;
    }
    // It's a file path
    const resolvedPath = path.isAbsolute(input) ? input : path.resolve(process.cwd(), input);
    return fs.readFileSync(resolvedPath);
  }
}
