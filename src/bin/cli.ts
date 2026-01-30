#!/usr/bin/env node

import { parseArgs } from 'node:util';
import path from 'path';
import fs from 'fs';
import { BeforeAndAfter, generateFilename } from '../index.js';
import { ViewportConfig } from '../types.js';
import { closeBrowser } from '../browser.js';
import { uploadBeforeAfter } from '../upload.js';
import { copyToClipboard } from '../clipboard.js';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    help: { type: 'boolean', short: 'h' },
    // Viewport presets (default: desktop)
    mobile: { type: 'boolean', short: 'm' },
    tablet: { type: 'boolean', short: 't' },
    size: { type: 'string' }, // WxH custom size
    // Capture options
    full: { type: 'boolean', short: 'f' },
    selector: { type: 'string', short: 's' },
    // Output options
    output: { type: 'string', short: 'o' },
    markdown: { type: 'boolean' },
    'upload-url': { type: 'string' },
  },
});

function printHelp(): void {
  console.log(`
before-and-after — Screenshot comparison tool

USAGE:
  before-and-after <before> <after> [selector] [selector2]

  Arguments can be URLs or image files (auto-detected).
  Selectors are optional - use one for both, or two for different selectors.

VIEWPORT OPTIONS:
      (default)              Desktop viewport (1280x800)
  -m, --mobile               Mobile viewport (375x812)
  -t, --tablet               Tablet viewport (768x1024)
      --size <WxH>           Custom viewport (e.g., 1920x1080)

CAPTURE OPTIONS:
  -f, --full                 Capture full scrollable page
  -s, --selector <css>       Scroll element into view before capture

OUTPUT OPTIONS:
  -o, --output <dir>         Output directory (default: ~/Downloads)
      --markdown             Upload images & output markdown table
      --upload-url <url>     Custom upload endpoint (default: 0x0.st)
                             Auto-detects: 0x0.st, blob.vercel, generic PUT

OTHER OPTIONS:
  -h, --help                 Show this help

EXAMPLES:
  # Compare two URLs (protocol optional)
  before-and-after google.com facebook.com
  before-and-after https://old.example.com https://new.example.com

  # With selectors (same for both)
  before-and-after url1 url2 ".hero-section"

  # With different selectors
  before-and-after url1 url2 ".old-hero" ".new-hero"

  # Mobile viewport
  before-and-after url1 url2 --mobile

  # Full page capture
  before-and-after url1 url2 --full

  # Custom viewport size
  before-and-after url1 url2 --size 1920x1080

  # Use existing images (auto-detected)
  before-and-after before.png after.png --markdown
`);
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff'];

/**
 * Check if a path looks like an image file.
 */
function isImageFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext) && fs.existsSync(filePath);
}

/**
 * Normalize URL by adding protocol if not specified.
 * Uses http:// for localhost/127.0.0.1, https:// for everything else.
 */
function normalizeUrl(url: string): string {
  if (/^(https?|file):\/\//i.test(url)) {
    return url;
  }
  // Use http for localhost addresses
  if (/^(localhost|127\.0\.0\.1)(:|\/|$)/i.test(url)) {
    return `http://${url}`;
  }
  return `https://${url}`;
}

function resolveViewport(): ViewportConfig {
  if (values.mobile) return 'mobile';
  if (values.tablet) return 'tablet';
  if (values.size) {
    const match = values.size.match(/^(\d+)x(\d+)$/);
    if (match) {
      return { width: parseInt(match[1]), height: parseInt(match[2]) };
    }
    console.error(`Invalid size: ${values.size}. Use WxH format (e.g., 1920x1080).`);
    process.exit(1);
  }
  return 'desktop';
}

async function main(): Promise<void> {
  if (values.help) {
    printHelp();
    return;
  }

  if (positionals.length < 2) {
    console.error('Two arguments required (URLs or image paths). Run with --help for usage.');
    process.exit(1);
  }

  const [first, second, ...rest] = positionals;
  const viewport = resolveViewport();
  const ba = new BeforeAndAfter({ viewport });

  try {
    // Auto-detect image mode
    if (isImageFile(first) && isImageFile(second)) {
      const result = await ba.fromImages({
        before: first,
        after: second,
      });

      if (values.markdown) {
        console.log(result.markdown);
      } else {
        console.log(`Before: ${first}`);
        console.log(`After:  ${second}`);
      }
      return;
    }

    // URL mode
    const beforeUrl = normalizeUrl(first);
    const afterUrl = normalizeUrl(second);

    // Resolve selectors: positional args override -s flag
    // 1 extra arg = same selector for both
    // 2 extra args = different selectors
    let beforeSelector = values.selector;
    let afterSelector = values.selector;

    if (rest.length >= 1) {
      beforeSelector = rest[0];
      afterSelector = rest[0]; // Same for both by default
    }
    if (rest.length >= 2) {
      afterSelector = rest[1]; // Different for after
    }

    const outputDir = values.output || path.join(process.env.HOME || '~', 'Downloads');
    fs.mkdirSync(outputDir, { recursive: true });

    console.log(`Capturing before: ${beforeUrl}${beforeSelector ? ` (${beforeSelector})` : ''}`);
    console.log(`Capturing after:  ${afterUrl}${afterSelector ? ` (${afterSelector})` : ''}`);

    const result = await ba.captureBeforeAfter({
      before: {
        url: beforeUrl,
        selector: beforeSelector,
        fullPage: values.full,
      },
      after: {
        url: afterUrl,
        selector: afterSelector,
        fullPage: values.full,
      },
    });

    // Generate filenames
    const timestamp = new Date();
    const beforeFilename = generateFilename({
      url: beforeUrl,
      suffix: 'before',
      timestamp,
    });

    const afterFilename = generateFilename({
      url: afterUrl,
      suffix: 'after',
      timestamp,
    });

    const beforePath = path.join(outputDir, beforeFilename);
    const afterPath = path.join(outputDir, afterFilename);
    fs.writeFileSync(beforePath, result.before.image);
    fs.writeFileSync(afterPath, result.after.image);
    console.log(`\nSaved: ${beforePath}`);
    console.log(`Saved: ${afterPath}`);

    // Output markdown if requested - upload images and copy to clipboard
    if (values.markdown) {
      const uploadUrl = values['upload-url'] || process.env.UPLOAD_URL;
      console.log(`\nUploading images${uploadUrl ? ` to ${uploadUrl}` : ''}...`);

      const { beforeUrl, afterUrl } = await uploadBeforeAfter(
        { image: result.before.image, filename: beforeFilename },
        { image: result.after.image, filename: afterFilename },
        uploadUrl
      );

      console.log(`Before: ${beforeUrl}`);
      console.log(`After:  ${afterUrl}`);

      const markdown = `| Before | After |
|:------:|:-----:|
| ![Before](${beforeUrl}) | ![After](${afterUrl}) |`;

      console.log(`\n${markdown}`);

      if (copyToClipboard(markdown)) {
        console.log(`\n✓ Markdown copied to clipboard`);
      }
    }
  } finally {
    closeBrowser();
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
