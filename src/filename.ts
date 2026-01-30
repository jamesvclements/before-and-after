export interface FilenameOptions {
  /** Page title from <title> tag */
  pageTitle?: string;
  /** URL to extract slug from */
  url?: string;
  /** Element identifier (data-testid, id, or class) */
  elementId?: string;
  /** Timestamp for the filename */
  timestamp?: Date;
  /** Suffix (before/after/diff) */
  suffix?: 'before' | 'after' | 'diff';
}

/**
 * Slugify text for use in filenames.
 * Converts to lowercase, replaces non-alphanumeric with hyphens, limits length.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

/**
 * Extract a slug from a URL pathname.
 * Examples:
 *   https://example.com/about → about
 *   https://example.com/products/shoes → products-shoes
 *   file:///path/to/page.html → page
 */
function extractSlugFromUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);

    // For file:// URLs, use the filename without extension
    if (parsed.protocol === 'file:') {
      const parts = parsed.pathname.split('/');
      const filename = parts[parts.length - 1];
      return filename.replace(/\.[^.]+$/, ''); // Remove extension
    }

    // For http/https URLs, use the pathname
    let pathname = parsed.pathname;

    // Remove leading/trailing slashes
    pathname = pathname.replace(/^\/+|\/+$/g, '');

    // If empty (homepage), use domain
    if (!pathname) {
      return parsed.hostname.replace(/^www\./, '');
    }

    // Replace slashes with hyphens
    return pathname.replace(/\//g, '-');
  } catch {
    return undefined;
  }
}

/**
 * Generate a semantic filename for screenshots.
 *
 * Format: {page-name}[-{element-id}][-{suffix}]-{timestamp}.png
 *
 * Examples:
 *   homepage-before-2026-01-26T15-30-45.png
 *   about-us-hero-after-2026-01-26T15-30-45.png
 *   pricing-card-diff-2026-01-26T15-30-45.png
 */
export function generateFilename(options: FilenameOptions): string {
  // 1. Page name: title → URL slug → "page"
  let pageName = 'page';
  if (options.pageTitle) {
    pageName = slugify(options.pageTitle);
  } else if (options.url) {
    const urlSlug = extractSlugFromUrl(options.url);
    if (urlSlug) {
      pageName = slugify(urlSlug);
    }
  }

  // 2. Element identifier (optional)
  const elementPart = options.elementId ? `-${slugify(options.elementId)}` : '';

  // 3. Suffix (before/after/diff)
  const suffixPart = options.suffix ? `-${options.suffix}` : '';

  // 4. Timestamp (ISO 8601 format, safe for filenames)
  const timestamp = (options.timestamp || new Date())
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);

  return `${pageName}${elementPart}${suffixPart}-${timestamp}.png`;
}
