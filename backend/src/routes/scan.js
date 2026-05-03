/**
 * PhishGuard AI — Scan Router
 * POST /api/scan    → Run a URL through the phishing detector
 * GET  /api/scan/stats → Aggregate statistics
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { analyseUrl } = require('../engine/phishingDetector');
const { addLog, getStats } = require('../data/store');

const router = express.Router();

// POST /api/scan
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'URL is required and must be a non-empty string.',
      });
    }

    const result = await analyseUrl(url.trim());

    const logEntry = {
      id: uuidv4(),
      ...result,
      createdAt: new Date().toISOString(),
    };

    addLog(logEntry);

    return res.status(200).json({
      success: true,
      data: logEntry,
    });
  } catch (err) {
    console.error('[SCAN ERROR]', err.message);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during URL analysis.',
    });
  }
});

// GET /api/scan/stats
router.get('/stats', (req, res) => {
  const stats = getStats();
  res.json({ success: true, data: stats });
});

module.exports = router;
