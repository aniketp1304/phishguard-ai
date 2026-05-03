/**
 * PhishGuard AI — Logs Router
 * GET /api/logs    → Retrieve paginated scan history
 */

const express = require('express');
const { getLogs } = require('../data/store');

const router = express.Router();

// GET /api/logs
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 20, verdict } = req.query;

    const result = getLogs({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      verdict,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error('[LOGS ERROR]', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch logs.',
    });
  }
});

module.exports = router;
