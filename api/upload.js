const path = require('path');
const { put } = require('@vercel/blob');
require('dotenv').config();

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Filename');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const rawFilename = urlObj.searchParams.get('filename') || req.headers['x-filename'] || 'upload.jpg';
    const cleanFilename = `products/${Date.now()}_${path.basename(rawFilename).replace(/\s+/g, '_')}`;

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: 'Empty file body' });
    }

    const contentType = req.headers['content-type'] || 'image/jpeg';
    const blob = await put(cleanFilename, buffer, {
      access: 'public',
      contentType: contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return res.status(200).json({ ok: true, url: blob.url });
  } catch (err) {
    console.error('Vercel Blob upload error:', err);
    return res.status(500).json({ error: err.message });
  }
};
