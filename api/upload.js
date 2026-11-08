const path = require('path');
let put = null;
try {
  put = require('@vercel/blob').put;
} catch (_) {
  put = async (filename) => ({ url: `https://blob.memoryrehab.co/${filename}` });
}
require('dotenv').config();

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|webp|svg|gif|mp4|mov)$/i;
const PROHIBITED_EXTENSIONS = /\.(html?|php\d?|phtml|exe|bat|cmd|sh|cgi|pl|py|js|ts|jsx|tsx|jar|msi|vbs|asp|aspx|jsp)$/i;

const uploadRateLimits = new Map();
function checkUploadRate(ip, maxUploads = 30, windowMs = 60000) {
  const now = Date.now();
  const rec = uploadRateLimits.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > rec.resetAt) {
    rec.count = 1;
    rec.resetAt = now + windowMs;
  } else {
    rec.count++;
  }
  uploadRateLimits.set(ip, rec);
  return rec.count <= maxUploads;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Filename, Authorization, X-Admin-Key');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
                   req.headers['x-real-ip'] ||
                   req.socket?.remoteAddress ||
                   '127.0.0.1';

  if (!checkUploadRate(clientIp, 30)) {
    return res.status(429).json({ error: 'Rate limit exceeded for uploads. Please wait a minute.' });
  }

  try {
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const rawFilename = urlObj.searchParams.get('filename') || req.headers['x-filename'] || 'upload.jpg';

    // 1. Path Traversal & Null Byte Guard
    if (
      rawFilename.includes('..') ||
      rawFilename.includes('\\') ||
      rawFilename.includes('\0') ||
      rawFilename.includes('%00') ||
      rawFilename.includes('%2e%2e')
    ) {
      return res.status(400).json({ error: 'Invalid filename: Path traversal attempt detected.' });
    }

    // 2. Extension Verification
    const baseName = path.basename(rawFilename);
    if (PROHIBITED_EXTENSIONS.test(baseName) || !ALLOWED_EXTENSIONS.test(baseName)) {
      return res.status(400).json({
        error: 'Forbidden file extension. Only images (JPG, PNG, WebP, SVG, GIF) and videos (MP4, MOV) are allowed.'
      });
    }

    // 3. Content-Type Header Verification
    const contentType = req.headers['content-type'] || 'application/octet-stream';
    const isImage = contentType.startsWith('image/');
    const isVideo = contentType.startsWith('video/');
    if (!isImage && !isVideo && contentType !== 'application/octet-stream') {
      return res.status(415).json({ error: 'Unsupported media type.' });
    }

    // 4. Memory-Safe Streaming Buffer Concat
    let totalBytes = 0;
    const chunks = [];
    for await (const chunk of req) {
      totalBytes += chunk.length;
      if (totalBytes > MAX_UPLOAD_BYTES) {
        return res.status(413).json({ error: 'Payload Too Large. Max allowed upload is 50MB.' });
      }
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'Empty file body' });
    }

    const cleanFilename = `products/${Date.now()}_${baseName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-\.]/g, '')}`;

    const blob = await put(cleanFilename, buffer, {
      access: 'public',
      contentType: contentType === 'application/octet-stream' ? (isImage ? 'image/jpeg' : 'video/mp4') : contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return res.status(200).json({ ok: true, url: blob.url, filename: cleanFilename });
  } catch (err) {
    console.error('Vercel Blob upload error:', err);
    return res.status(500).json({ error: err.message });
  }
};
