/**
 * Image upload for generating shareable URLs.
 * Auto-detects service from URL, defaults to 0x0.st
 */

const DEFAULT_UPLOAD_URL = 'https://0x0.st';

/**
 * Upload an image and return a public URL.
 * Auto-detects upload method from URL pattern.
 */
export async function uploadImage(
  image: Buffer,
  filename: string,
  uploadUrl: string = DEFAULT_UPLOAD_URL
): Promise<string> {
  // 0x0.st uses multipart form upload
  if (uploadUrl.includes('0x0.st')) {
    return upload0x0st(image, filename, uploadUrl);
  }

  // Vercel Blob uses PUT with specific headers
  if (uploadUrl.includes('blob.vercel')) {
    return uploadVercelBlob(image, filename, uploadUrl);
  }

  // Generic PUT upload (common for S3-compatible services)
  return uploadGenericPut(image, filename, uploadUrl);
}

async function upload0x0st(image: Buffer, filename: string, url: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', new Blob([image]), filename);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'User-Agent': 'before-after-cli/1.0' },
    body: formData,
  });

  const result = (await response.text()).trim();
  if (!result.startsWith('http')) {
    throw new Error(`Upload failed: ${result}`);
  }
  return result;
}

async function uploadVercelBlob(image: Buffer, filename: string, url: string): Promise<string> {
  const response = await fetch(`${url}/${filename}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    body: image,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const result = await response.json() as { url: string };
  return result.url;
}

async function uploadGenericPut(image: Buffer, filename: string, url: string): Promise<string> {
  const response = await fetch(`${url}/${filename}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    body: image,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  // Try to parse JSON response, fall back to URL from location header or constructed URL
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const result = await response.json() as { url?: string };
    if (result.url) return result.url;
  }

  return response.headers.get('location') || `${url}/${filename}`;
}

/**
 * Upload before/after images in parallel and return URLs
 */
export async function uploadBeforeAfter(
  before: { image: Buffer; filename: string },
  after: { image: Buffer; filename: string },
  uploadUrl?: string
): Promise<{ beforeUrl: string; afterUrl: string }> {
  const [beforeUrl, afterUrl] = await Promise.all([
    uploadImage(before.image, before.filename, uploadUrl),
    uploadImage(after.image, after.filename, uploadUrl),
  ]);

  return { beforeUrl, afterUrl };
}
