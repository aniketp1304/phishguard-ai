/**
 * PhishGuard AI — Backend Entry Point
 * Express server configuration and middleware setup.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const scanRoutes = require('./routes/scan');
const logsRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 5050;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(helmet()); // Security headers
app.use(cors());   // Allow frontend origin requests
app.use(express.json()); // Parse JSON payloads
app.use(morgan('dev')); // HTTP request logger

// ─── Health & Root ────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({ message: 'PhishGuard AI Backend API is running.', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/scan', scanRoutes);
app.use('/api/logs', logsRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────

app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Endpoint not found.' });
});

app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`[READY] PhishGuard API is listening on port ${PORT}`);
  console.log(`[INFO]  Health check available at http://localhost:${PORT}/health`);
});
