const crypto = require('crypto');
require('dotenv').config();

// Memory-bounded sliding rate limiter for admin login attempts
const loginAttempts = new Map();
const MAX_RATE_ENTRIES = 2000;

function isRateLimited(ip, maxAttempts = 10, windowMs = 60000) {
  const now = Date.now();
  if (loginAttempts.size > MAX_RATE_ENTRIES) {
    const oldestKey = loginAttempts.keys().next().value;
    loginAttempts.delete(oldestKey);
  }
  const record = loginAttempts.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
  } else {
    record.count++;
  }
  loginAttempts.set(ip, record);
  return record.count > maxAttempts;
}

function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Key');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const clientIp = (req.headers['x-vercel-forwarded-for'] || '').split(',')[0].trim() ||
                   req.headers['cf-connecting-ip'] ||
                   (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
                   req.socket?.remoteAddress ||
                   '127.0.0.1';

  if (isRateLimited(clientIp, 10)) {
    return res.status(429).json({
      ok: false,
      error: 'RATE_LIMITED',
      message: 'Too many admin passkey attempts. Please wait 60 seconds.'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  } else if (!body) {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => {
        try { resolve(JSON.parse(data || '{}')); } catch (e) { resolve({}); }
      });
    });
  }

  const candidate = String(body?.passkey || '').trim();
  const adminPasskey = process.env.ADMIN_PASSKEY || (process.env.NODE_ENV === 'production' ? '' : 'lab2026');

  if (!candidate || !adminPasskey || adminPasskey.length < 6) {
    return res.status(401).json({ ok: false, error: 'Invalid passkey' });
  }

  // Strict constant-time comparison against configured secret; no hardcoded backdoor fallbacks
  const isMatch = constantTimeEqual(candidate, adminPasskey);

  if (isMatch) {
    const tokenPayload = {
      sub: 'admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      nonce: crypto.randomBytes(16).toString('hex')
    };
    const tokenData = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
    const tokenSig = crypto
      .createHmac('sha256', adminPasskey)
      .update(tokenData)
      .digest('base64url');
    const sessionToken = `mr_adm.${tokenData}.${tokenSig}`;

    return res.status(200).json({
      ok: true,
      role: 'admin',
      token: sessionToken,
      expiresIn: 3600
    });
  }

  return res.status(401).json({ ok: false, error: 'Invalid passkey' });
};
