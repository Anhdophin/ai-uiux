const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8787;
const HOST = process.env.HOST || '127.0.0.1';
const APP_ROOT = path.join(__dirname, '..');
const fileWriteQueues = new Map();

const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const SECURITY_FILE = path.join(DATA_DIR, 'security-events.json');

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false
}));
app.use(cors({
  origin: true,
  credentials: false
}));
app.use(express.json({ limit: '150kb' }));
app.use(morgan('dev'));

function sanitizeText(input, maxLength) {
  return String(input || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email) {
  const value = String(email || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseJsonArraySafely(raw) {
  const normalized = String(raw || '').trim();
  if (!normalized) return [];

  try {
    const parsed = JSON.parse(normalized);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const firstBracket = normalized.indexOf('[');
    const lastBracket = normalized.lastIndexOf(']');

    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      const candidate = normalized.slice(firstBracket, lastBracket + 1);
      const parsed = JSON.parse(candidate);
      return Array.isArray(parsed) ? parsed : [];
    }

    throw error;
  }
}

function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

async function readJsonArray(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return parseJsonArraySafely(raw);
  } catch (error) {
    if (error.code === 'ENOENT') return [];

    console.error('Failed to read JSON array:', filePath, error.message);
    const backupPath = filePath.replace(/\.json$/i, '') + `.corrupt-${Date.now()}.json`;

    try {
      await fs.copyFile(filePath, backupPath);
    } catch (copyError) {
      console.error('Failed to back up corrupt JSON file:', copyError.message);
    }

    return [];
  }
}

async function writeJsonArray(filePath, value) {
  const previous = fileWriteQueues.get(filePath) || Promise.resolve();
  const nextWrite = previous
    .catch(function () {
      return undefined;
    })
    .then(async function () {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(value, null, 2), 'utf8');
    });

  fileWriteQueues.set(filePath, nextWrite);
  await nextWrite;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'lotus-yoga-backend', time: new Date().toISOString() });
});

app.post('/api/leads', asyncHandler(async (req, res) => {
  const fullName = sanitizeText(req.body.fullName || req.body.full_name, 120);
  const email = sanitizeText(req.body.email, 180).toLowerCase();
  const phone = sanitizeText(req.body.phone, 40);
  const message = sanitizeText(req.body.message, 1000);
  const source = sanitizeText(req.body.source || 'web', 80);

  if (!fullName || !email) {
    return res.status(400).json({ ok: false, error: 'fullName and email are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email format.' });
  }

  const leads = await readJsonArray(LEADS_FILE);
  const lead = {
    id: Date.now().toString(36),
    fullName,
    email,
    phone,
    message,
    source,
    ip: req.ip,
    userAgent: sanitizeText(req.headers['user-agent'], 300),
    createdAt: new Date().toISOString()
  };

  leads.unshift(lead);
  const maxEntries = 1500;
  if (leads.length > maxEntries) {
    leads.length = maxEntries;
  }

  await writeJsonArray(LEADS_FILE, leads);
  return res.status(201).json({ ok: true, id: lead.id });
}));

app.post('/api/security-events', asyncHandler(async (req, res) => {
  const type = sanitizeText(req.body.type, 80);
  const details = typeof req.body.details === 'object' && req.body.details !== null
    ? req.body.details
    : {};
  const page = sanitizeText(req.body.page || req.headers.referer || '', 500);
  const level = sanitizeText(req.body.level || 'warn', 20);

  if (!type) {
    return res.status(400).json({ ok: false, error: 'type is required.' });
  }

  const events = await readJsonArray(SECURITY_FILE);
  const event = {
    id: Date.now().toString(36),
    type,
    details,
    level,
    page,
    ip: req.ip,
    userAgent: sanitizeText(req.headers['user-agent'], 300),
    createdAt: new Date().toISOString()
  };

  events.unshift(event);
  const maxEntries = 3000;
  if (events.length > maxEntries) {
    events.length = maxEntries;
  }

  await writeJsonArray(SECURITY_FILE, events);
  return res.status(201).json({ ok: true, id: event.id });
}));

app.get('/api/security-events', asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const events = await readJsonArray(SECURITY_FILE);
  res.json({ ok: true, total: events.length, items: events.slice(0, limit) });
}));

app.get('/api/leads', asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const leads = await readJsonArray(LEADS_FILE);
  res.json({ ok: true, total: leads.length, items: leads.slice(0, limit) });
}));

app.use(express.static(APP_ROOT));

app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ ok: false, error: 'Internal server error.' });
});

app.listen(PORT, HOST, () => {
  console.log(`Backend running at http://${HOST}:${PORT}`);
});
