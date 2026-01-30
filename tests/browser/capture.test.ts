import { describe, it, expect } from 'vitest';
import path from 'path';
import { captureScreenshot, captureBeforeAfter } from '../../src/capture';

const TEST_PAGES = path.resolve(__dirname, '../fixtures/pages');

function fileUrl(relativePath: string): string {
  return `file://${path.join(TEST_PAGES, relativePath)}`;
}

function isValidPng(buf: Buffer): boolean {
  // Check PNG magic bytes: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  return buf.length > 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4E &&
    buf[3] === 0x47;
}

function getPngDimensions(buf: Buffer): { width: number; height: number } {
  // PNG dimensions are at bytes 16-23 (IHDR chunk)
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

describe('captureScreenshot', () => {
  it('captures screenshot from file:// URL', async () => {
    const result = await captureScreenshot({
      url: fileUrl('css-card/before.html'),
    });
    expect(result.image).toBeInstanceOf(Buffer);
    expect(result.image.length).toBeGreaterThan(1000);
    expect(isValidPng(result.image)).toBe(true);
    expect(result.url).toContain('css-card/before.html');
  });

  it('captures full page screenshot', async () => {
    const result = await captureScreenshot({
      url: fileUrl('responsive-layout/after.html'),
      fullPage: true,
    });
    expect(isValidPng(result.image)).toBe(true);
    const dims = getPngDimensions(result.image);
    // Full page should be at least viewport height
    expect(dims.height).toBeGreaterThanOrEqual(result.viewport.height);
  });

  it('scrolls element into view when selector provided', async () => {
    const result = await captureScreenshot({
      url: fileUrl('css-card/before.html'),
      selector: '.card',
    });
    expect(isValidPng(result.image)).toBe(true);
    expect(result.selector).toBe('.card');
    // Screenshot is still viewport-sized (selector scrolls into view)
    const dims = getPngDimensions(result.image);
    expect(dims.width).toBe(result.viewport.width);
  });

  it('applies desktop viewport by default', async () => {
    const result = await captureScreenshot({
      url: fileUrl('css-card/before.html'),
    });
    expect(result.viewport).toEqual({ width: 1280, height: 800 });
  });

  it('applies mobile viewport when configured', async () => {
    const result = await captureScreenshot({
      url: fileUrl('css-card/before.html'),
      viewport: 'mobile',
    });
    expect(result.viewport).toEqual({ width: 375, height: 812 });
    const dims = getPngDimensions(result.image);
    expect(dims.width).toBe(375);
  });

  it('applies tablet viewport when configured', async () => {
    const result = await captureScreenshot({
      url: fileUrl('css-card/before.html'),
      viewport: 'tablet',
    });
    expect(result.viewport).toEqual({ width: 768, height: 1024 });
  });

  it('applies custom viewport dimensions', async () => {
    const result = await captureScreenshot({
      url: fileUrl('css-card/before.html'),
      viewport: { width: 1920, height: 1080 },
    });
    expect(result.viewport).toEqual({ width: 1920, height: 1080 });
    const dims = getPngDimensions(result.image);
    expect(dims.width).toBe(1920);
  });

  it('captures at 1x scale (viewport matches image size)', async () => {
    const result = await captureScreenshot({
      url: fileUrl('css-card/before.html'),
      viewport: { width: 400, height: 300 },
    });
    expect(result.viewport).toEqual({ width: 400, height: 300 });
    const dims = getPngDimensions(result.image);
    expect(dims.width).toBe(400);
    expect(dims.height).toBe(300);
  });
});

describe('captureBeforeAfter', () => {
  it('captures before and after as a pair from string URLs', async () => {
    const result = await captureBeforeAfter({
      before: fileUrl('css-card/before.html'),
      after: fileUrl('css-card/after.html'),
    });
    expect(isValidPng(result.before.image)).toBe(true);
    expect(isValidPng(result.after.image)).toBe(true);
    expect(result.before.url).toContain('before.html');
    expect(result.after.url).toContain('after.html');
  });

  it('captures before and after with shared viewport', async () => {
    const result = await captureBeforeAfter({
      before: fileUrl('css-card/before.html'),
      after: fileUrl('css-card/after.html'),
      viewport: 'mobile',
    });
    expect(result.before.viewport).toEqual({ width: 375, height: 812 });
    expect(result.after.viewport).toEqual({ width: 375, height: 812 });
  });

  it('captures before and after with individual options', async () => {
    const result = await captureBeforeAfter({
      before: {
        url: fileUrl('css-card/before.html'),
        selector: '.card',
      },
      after: {
        url: fileUrl('css-card/after.html'),
        selector: '.card',
      },
    });
    expect(result.before.selector).toBe('.card');
    expect(result.after.selector).toBe('.card');
    expect(isValidPng(result.before.image)).toBe(true);
    expect(isValidPng(result.after.image)).toBe(true);
  });
});
