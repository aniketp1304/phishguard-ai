/**
 * PhishGuard AI — Backend Entry Point
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const scanRoutes = require('./routes/scan');
const logsRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health routes
app.get('/', (req, res) => {
  res.json({ message: 'PhishGuard AI Backend API is running.', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/scan', scanRoutes);
app.use('/api/logs', logsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`[READY] PhishGuard API is listening on port ${PORT}`);
  console.log(`[INFO]  Health check available at http://localhost:${PORT}/health`);
});