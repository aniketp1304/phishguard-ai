/**
 * PhishGuard AI — In-Memory Data Store
 * Centralised store for scan logs and running statistics.
 * Easily replaceable with MongoDB / Redis for production.
 */

const store = {
  /** Ordered list of scan results (newest first) */
  logs: [],

  /** Running aggregate statistics */
  stats: {
    totalScans: 0,
    safeCount: 0,
    phishingCount: 0,
    suspiciousCount: 0,
  },
};

/**
 * Append a scan result to the log and update stats.
 * @param {object} entry  – A completed scan result object
 */
function addLog(entry) {
  store.logs.unshift(entry); // newest first
  store.stats.totalScans += 1;

  if (entry.verdict === 'SAFE') store.stats.safeCount += 1;
  else if (entry.verdict === 'PHISHING') store.stats.phishingCount += 1;
  else store.stats.suspiciousCount += 1;

  // Cap log length at 500 entries (memory guard)
  if (store.logs.length > 500) store.logs.pop();
}

function getLogs({ page = 1, limit = 20, verdict } = {}) {
  let filtered = verdict
    ? store.logs.filter((l) => l.verdict === verdict.toUpperCase())
    : store.logs;

  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

function getStats() {
  return { ...store.stats };
}

function clearLogs() {
  store.logs = [];
  store.stats = { totalScans: 0, safeCount: 0, phishingCount: 0, suspiciousCount: 0 };
}

module.exports = { addLog, getLogs, getStats, clearLogs };
