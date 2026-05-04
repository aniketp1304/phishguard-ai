const express = require('express');
const router = express.Router();
const { getLogs } = require('../data/store');

router.get('/', (req, res) => {
  const { page, limit, verdict } = req.query;
  
  const results = getLogs({ 
    page: parseInt(page) || 1, 
    limit: parseInt(limit) || 20, 
    verdict 
  });

  res.json({
    success: true,
    ...results
  });
});

module.exports = router;