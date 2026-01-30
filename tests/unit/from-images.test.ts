import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BeforeAndAfter } from '../../src/index.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Create a minimal valid PNG for testing
function createMinimalPng(): Buffer {
  // Minimal 1x1 transparent PNG
  return Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
    0x00, 0x00, 0x00, 0x0d, // IHDR length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width = 1
    0x00, 0x00, 0x00, 0x01, // height = 1
    0x08, 0x06, 0x00, 0x00, 0x00, // 8-bit RGBA
    0x1f, 0x15, 0xc4, 0x89, // CRC
    0x00, 0x00, 0x00, 0x0a, // IDAT length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, // compressed data
    0x0d, 0x0a, 0x2d, 0xb4, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND length
    0x49, 0x45, 0x4e, 0x44, // IEND
    0xae, 0x42, 0x60, 0x82, // CRC
  ]);
}

describe('fromImages', () => {
  describe('with Buffer inputs', () => {
    it('accepts Buffer inputs and generates markdown', async () => {
      const before = createMinimalPng();
      const after = createMinimalPng();

      const ba = new BeforeAndAfter();
      const result = await ba.fromImages({
        before,
        after,
      });

      expect(result.markdown).toContain('| Before | After |');
      expect(result.markdown).toContain('|:------:|:-----:|');
      expect(result.beforeImage).toBeInstanceOf(Buffer);
      expect(result.afterImage).toBeInstanceOf(Buffer);
    });

    it('returns the same buffers that were passed in', async () => {
      const before = createMinimalPng();
      const after = createMinimalPng();

      const ba = new BeforeAndAfter();
      const result = await ba.fromImages({
        before,
        after,
      });

      expect(result.beforeImage).toBe(before);
      expect(result.afterImage).toBe(after);
    });

    it('uses custom labels in markdown', async () => {
      const image = createMinimalPng();

      const ba = new BeforeAndAfter();
      const result = await ba.fromImages({
        before: image,
        after: image,
        labels: { before: 'Old Version', after: 'New Version' },
      });

      expect(result.markdown).toContain('| Old Version | New Version |');
      expect(result.markdown).toContain('![Old Version]');
      expect(result.markdown).toContain('![New Version]');
    });

    it('uses default placeholder paths in markdown for Buffer inputs', async () => {
      const ba = new BeforeAndAfter();
      const result = await ba.fromImages({
        before: createMinimalPng(),
        after: createMinimalPng(),
      });

      expect(result.markdown).toContain('![Before](before.png)');
      expect(result.markdown).toContain('![After](after.png)');
    });
  });

  describe('with file path inputs', () => {
    const TEMP_DIR = path.join(os.tmpdir(), 'from-images-test-' + Date.now());
    let beforePath: string;
    let afterPath: string;

    beforeEach(() => {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
      beforePath = path.join(TEMP_DIR, 'before.png');
      afterPath = path.join(TEMP_DIR, 'after.png');
      fs.writeFileSync(beforePath, createMinimalPng());
      fs.writeFileSync(afterPath, createMinimalPng());
    });

    afterEach(() => {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    });

    it('reads images from file paths', async () => {
      const ba = new BeforeAndAfter();
      const result = await ba.fromImages({
        before: beforePath,
        after: afterPath,
      });

      expect(result.beforeImage).toBeInstanceOf(Buffer);
      expect(result.afterImage).toBeInstanceOf(Buffer);
      // Should be valid PNG
      expect(result.beforeImage[0]).toBe(0x89);
      expect(result.beforeImage[1]).toBe(0x50);
    });

    it('includes file paths in markdown', async () => {
      const ba = new BeforeAndAfter();
      const result = await ba.fromImages({
        before: beforePath,
        after: afterPath,
      });

      expect(result.markdown).toContain(`![Before](${beforePath})`);
      expect(result.markdown).toContain(`![After](${afterPath})`);
    });

    it('resolves relative file paths', async () => {
      const cwd = process.cwd();
      try {
        process.chdir(TEMP_DIR);

        const ba = new BeforeAndAfter();
        const result = await ba.fromImages({
          before: 'before.png',
          after: 'after.png',
        });

        expect(result.beforeImage).toBeInstanceOf(Buffer);
        expect(result.afterImage).toBeInstanceOf(Buffer);
      } finally {
        process.chdir(cwd);
      }
    });

    it('throws on non-existent file', async () => {
      const ba = new BeforeAndAfter();
      await expect(
        ba.fromImages({
          before: '/nonexistent/path.png',
          after: afterPath,
        })
      ).rejects.toThrow();
    });
  });

  describe('with mixed inputs', () => {
    const TEMP_DIR = path.join(os.tmpdir(), 'from-images-mixed-' + Date.now());
    let filePath: string;

    beforeEach(() => {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
      filePath = path.join(TEMP_DIR, 'image.png');
      fs.writeFileSync(filePath, createMinimalPng());
    });

    afterEach(() => {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    });

    it('accepts Buffer for before and file path for after', async () => {
      const ba = new BeforeAndAfter();
      const result = await ba.fromImages({
        before: createMinimalPng(),
        after: filePath,
      });

      expect(result.beforeImage).toBeInstanceOf(Buffer);
      expect(result.afterImage).toBeInstanceOf(Buffer);
    });

    it('generates correct markdown for mixed inputs', async () => {
      const ba = new BeforeAndAfter();
      const result = await ba.fromImages({
        before: createMinimalPng(),
        after: filePath,
      });

      expect(result.markdown).toContain('![Before](before.png)');
      expect(result.markdown).toContain(`![After](${filePath})`);
    });
  });
});

describe('generateMarkdown', () => {
  it('generates GitHub-flavored markdown table', () => {
    const ba = new BeforeAndAfter();
    const markdown = ba.generateMarkdown(
      'Before',
      'After',
      '/path/to/before.png',
      '/path/to/after.png'
    );

    const lines = markdown.split('\n');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe('| Before | After |');
    expect(lines[1]).toBe('|:------:|:-----:|');
    expect(lines[2]).toBe('| ![Before](/path/to/before.png) | ![After](/path/to/after.png) |');
  });

  it('uses custom labels in table header', () => {
    const ba = new BeforeAndAfter();
    const markdown = ba.generateMarkdown(
      'Old Design',
      'New Design',
      'old.png',
      'new.png'
    );

    expect(markdown).toContain('| Old Design | New Design |');
    expect(markdown).toContain('![Old Design](old.png)');
    expect(markdown).toContain('![New Design](new.png)');
  });

  it('handles URLs as image paths', () => {
    const ba = new BeforeAndAfter();
    const markdown = ba.generateMarkdown(
      'Before',
      'After',
      'https://example.com/before.png',
      'https://example.com/after.png'
    );

    expect(markdown).toContain('![Before](https://example.com/before.png)');
    expect(markdown).toContain('![After](https://example.com/after.png)');
  });

  it('handles special characters in labels', () => {
    const ba = new BeforeAndAfter();
    const markdown = ba.generateMarkdown(
      'Version 1.0 (Legacy)',
      'Version 2.0 (Current)',
      'v1.png',
      'v2.png'
    );

    expect(markdown).toContain('| Version 1.0 (Legacy) | Version 2.0 (Current) |');
  });

  it('uses placeholder paths for Buffer inputs', () => {
    const ba = new BeforeAndAfter();
    const markdown = ba.generateMarkdown(
      'Before',
      'After',
      createMinimalPng(),
      createMinimalPng()
    );

    expect(markdown).toContain('![Before](before.png)');
    expect(markdown).toContain('![After](after.png)');
  });
});
