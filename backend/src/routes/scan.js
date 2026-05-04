const express = require('express');
const router = express.Router();
const { analyseUrl } = require('../engine/phishingDetector');
const { addLog, getStats } = require('../data/store');

// POST /api/scan
router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "URL is required"
    });
  }

  try {
    const result = await analyseUrl(url);
    
    // Create a log entry with additional fields if needed
    const logEntry = {
      ...result,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString()
    };

    addLog(logEntry);

    res.json({
      success: true,
      data: logEntry
    });
  } catch (error) {
    console.error('[SCAN ERROR]', error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during scanning"
    });
  }
});

// GET /api/scan/stats
router.get('/stats', (req, res) => {
  const stats = getStats();
  res.json({
    success: true,
    data: stats
  });
});

module.exports = router;