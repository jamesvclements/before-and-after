import { describe, it, expect } from 'vitest';
import { generateFilename } from '../../src/filename';

describe('generateFilename', () => {
  const fixedTimestamp = new Date('2026-01-26T15:30:45.123Z');

  describe('page name from pageTitle', () => {
    it('uses pageTitle when provided', () => {
      const result = generateFilename({
        pageTitle: 'My Awesome Page',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('my-awesome-page-2026-01-26T15-30-45.png');
    });

    it('slugifies special characters in title', () => {
      const result = generateFilename({
        pageTitle: 'Hello, World! — Test',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('hello-world-test-2026-01-26T15-30-45.png');
    });

    it('truncates long titles to 50 characters', () => {
      const result = generateFilename({
        pageTitle: 'This is a very long page title that should be truncated to fifty characters',
        timestamp: fixedTimestamp,
      });
      // The slugified version should be max 50 chars before suffix and timestamp
      expect(result.split('-2026')[0].length).toBeLessThanOrEqual(50);
    });
  });

  describe('page name from URL', () => {
    it('extracts slug from http URL pathname', () => {
      const result = generateFilename({
        url: 'https://example.com/about',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('about-2026-01-26T15-30-45.png');
    });

    it('extracts multi-level path as slug', () => {
      const result = generateFilename({
        url: 'https://example.com/products/shoes/running',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('products-shoes-running-2026-01-26T15-30-45.png');
    });

    it('uses domain for homepage (empty path)', () => {
      const result = generateFilename({
        url: 'https://www.example.com/',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('example-com-2026-01-26T15-30-45.png');
    });

    it('extracts filename without extension from file:// URL', () => {
      const result = generateFilename({
        url: 'file:///path/to/page.html',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('page-2026-01-26T15-30-45.png');
    });

    it('prefers pageTitle over URL when both provided', () => {
      const result = generateFilename({
        pageTitle: 'Custom Title',
        url: 'https://example.com/about',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('custom-title-2026-01-26T15-30-45.png');
    });
  });

  describe('fallback to default', () => {
    it('uses "page" when no pageTitle or URL provided', () => {
      const result = generateFilename({
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('page-2026-01-26T15-30-45.png');
    });

    it('uses "page" for invalid URL', () => {
      const result = generateFilename({
        url: 'not-a-valid-url',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('page-2026-01-26T15-30-45.png');
    });
  });

  describe('element identifier', () => {
    it('includes elementId in filename', () => {
      const result = generateFilename({
        pageTitle: 'Homepage',
        elementId: 'hero-section',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('homepage-hero-section-2026-01-26T15-30-45.png');
    });

    it('slugifies elementId', () => {
      const result = generateFilename({
        pageTitle: 'Page',
        elementId: '.card__title',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('page-card-title-2026-01-26T15-30-45.png');
    });

    it('handles CSS selector with special characters', () => {
      const result = generateFilename({
        pageTitle: 'Page',
        elementId: '#main-content > .sidebar',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('page-main-content-sidebar-2026-01-26T15-30-45.png');
    });
  });

  describe('suffix', () => {
    it('includes "before" suffix', () => {
      const result = generateFilename({
        pageTitle: 'Homepage',
        suffix: 'before',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('homepage-before-2026-01-26T15-30-45.png');
    });

    it('includes "after" suffix', () => {
      const result = generateFilename({
        pageTitle: 'Homepage',
        suffix: 'after',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('homepage-after-2026-01-26T15-30-45.png');
    });

    it('includes "diff" suffix', () => {
      const result = generateFilename({
        pageTitle: 'Homepage',
        suffix: 'diff',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('homepage-diff-2026-01-26T15-30-45.png');
    });

    it('combines elementId and suffix', () => {
      const result = generateFilename({
        url: 'https://example.com/pricing',
        elementId: 'card',
        suffix: 'before',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('pricing-card-before-2026-01-26T15-30-45.png');
    });
  });

  describe('timestamp', () => {
    it('uses provided timestamp', () => {
      const result = generateFilename({
        pageTitle: 'Test',
        timestamp: new Date('2025-12-31T23:59:59.999Z'),
      });
      expect(result).toBe('test-2025-12-31T23-59-59.png');
    });

    it('uses current time when no timestamp provided', () => {
      const result = generateFilename({
        pageTitle: 'Test',
      });
      // Should have a timestamp in format YYYY-MM-DDTHH-MM-SS
      expect(result).toMatch(/^test-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.png$/);
    });

    it('formats timestamp safely for filenames (no colons or dots)', () => {
      const result = generateFilename({
        pageTitle: 'Test',
        timestamp: fixedTimestamp,
      });
      expect(result).not.toContain(':');
      expect(result.match(/\./g)?.length).toBe(1); // Only .png extension
    });
  });

  describe('full filename composition', () => {
    it('generates complete filename with all parts', () => {
      const result = generateFilename({
        url: 'https://example.com/about-us',
        elementId: 'hero',
        suffix: 'after',
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('about-us-hero-after-2026-01-26T15-30-45.png');
    });

    it('generates minimal filename with no optional parts', () => {
      const result = generateFilename({
        timestamp: fixedTimestamp,
      });
      expect(result).toBe('page-2026-01-26T15-30-45.png');
    });
  });
});
