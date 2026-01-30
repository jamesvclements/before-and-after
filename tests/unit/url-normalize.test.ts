import { describe, it, expect } from 'vitest';

/**
 * Normalize URL by adding protocol if not specified.
 * Uses http:// for localhost/127.0.0.1, https:// for everything else.
 * This matches the CLI implementation exactly.
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

describe('normalizeUrl', () => {
  describe('adding https:// protocol', () => {
    it('adds https:// to bare domain', () => {
      expect(normalizeUrl('google.com')).toBe('https://google.com');
    });

    it('adds https:// to www domain', () => {
      expect(normalizeUrl('www.google.com')).toBe('https://www.google.com');
    });

    it('adds https:// to domain with path', () => {
      expect(normalizeUrl('example.com/path/to/page')).toBe('https://example.com/path/to/page');
    });

    it('adds https:// to domain with query string', () => {
      expect(normalizeUrl('example.com?foo=bar')).toBe('https://example.com?foo=bar');
    });

    it('adds https:// to domain with port', () => {
      expect(normalizeUrl('example.com:8080')).toBe('https://example.com:8080');
    });

    it('adds https:// to IP address (non-localhost)', () => {
      expect(normalizeUrl('192.168.1.1:8080')).toBe('https://192.168.1.1:8080');
    });
  });

  describe('localhost handling', () => {
    it('adds http:// to localhost with port', () => {
      expect(normalizeUrl('localhost:3000')).toBe('http://localhost:3000');
    });

    it('adds http:// to localhost without port', () => {
      expect(normalizeUrl('localhost')).toBe('http://localhost');
    });

    it('adds http:// to localhost with path', () => {
      expect(normalizeUrl('localhost/api/test')).toBe('http://localhost/api/test');
    });

    it('adds http:// to 127.0.0.1 with port', () => {
      expect(normalizeUrl('127.0.0.1:8080')).toBe('http://127.0.0.1:8080');
    });

    it('adds http:// to 127.0.0.1 without port', () => {
      expect(normalizeUrl('127.0.0.1')).toBe('http://127.0.0.1');
    });

    it('adds http:// to 127.0.0.1 with path', () => {
      expect(normalizeUrl('127.0.0.1/path')).toBe('http://127.0.0.1/path');
    });

    it('handles LOCALHOST case insensitively', () => {
      expect(normalizeUrl('LOCALHOST:3000')).toBe('http://LOCALHOST:3000');
    });
  });

  describe('preserving existing protocols', () => {
    it('preserves existing https://', () => {
      expect(normalizeUrl('https://google.com')).toBe('https://google.com');
    });

    it('preserves existing http://', () => {
      expect(normalizeUrl('http://localhost:3000')).toBe('http://localhost:3000');
    });

    it('preserves http:// on non-localhost', () => {
      expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('preserves file:// URLs', () => {
      expect(normalizeUrl('file:///path/to/file.html')).toBe('file:///path/to/file.html');
    });

    it('is case insensitive for protocol detection', () => {
      expect(normalizeUrl('HTTPS://EXAMPLE.COM')).toBe('HTTPS://EXAMPLE.COM');
      expect(normalizeUrl('HTTP://example.com')).toBe('HTTP://example.com');
      expect(normalizeUrl('FILE:///path')).toBe('FILE:///path');
    });
  });

  describe('edge cases', () => {
    it('handles domain that starts with "localhost" prefix', () => {
      // "localhostname.com" should NOT be treated as localhost
      expect(normalizeUrl('localhostname.com')).toBe('https://localhostname.com');
    });

    it('handles subdomain of localhost', () => {
      // This is a weird case but should use https
      expect(normalizeUrl('sub.localhost')).toBe('https://sub.localhost');
    });

    it('handles empty path after localhost', () => {
      expect(normalizeUrl('localhost:')).toBe('http://localhost:');
    });
  });
});
