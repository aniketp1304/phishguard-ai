/**
 * PhishGuard AI — Active Phishing Detection Engine (Level 10)
 *
 * Analyses a URL using active network requests (DNS, TLS, WHOIS, HTTP)
 * combined with heuristic signals to return a highly accurate risk score.
 */

const dns = require('dns').promises;
const tls = require('tls');
const axios = require('axios');
const whois = require('whois-json');
const cheerio = require('cheerio');

// ─── Constants & Signals ─────────────────────────────────────────────────────

const PHISHING_KEYWORDS = [
  'login', 'signin', 'sign-in', 'verify', 'verification',
  'secure', 'account', 'update', 'banking', 'bank',
  'paypal', 'apple', 'google', 'microsoft', 'amazon',
  'password', 'confirm', 'wallet', 'support', 'helpdesk',
];

const SUSPICIOUS_TLDS = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.click', '.link', '.download'];
const URL_SHORTENERS = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd'];
const BRAND_NAMES = ['paypal', 'apple', 'google', 'microsoft', 'amazon', 'netflix', 'facebook'];

// ─── Helper Utilities ─────────────────────────────────────────────────────────

function extractComponents(rawUrl) {
  const withProto = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  try {
    return new URL(withProto);
  } catch {
    return null;
  }
}

function getDomain(hostname) {
  const parts = hostname.split('.');
  if (parts.length < 2) return hostname;
  return parts.slice(-2).join('.');
}

// ─── Active Network Checks ────────────────────────────────────────────────────

async function performDnsCheck(hostname, signals) {
  try {
    const addresses = await dns.resolve4(hostname);
    signals.push({ name: 'Active DNS Resolution', weight: -5, severity: 'low', detail: `Resolved to ${addresses[0]}` });
  } catch (err) {
    signals.push({ name: 'DNS Resolution Failed', weight: 40, severity: 'critical', detail: 'Domain does not exist or has no A records' });
  }
}

async function performSslCheck(hostname, signals) {
  return new Promise((resolve) => {
    const socket = tls.connect({ host: hostname, port: 443, servername: hostname, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate();
      if (!cert || !cert.subject) {
        signals.push({ name: 'Invalid SSL Certificate', weight: 30, severity: 'high' });
      } else {
        // Let's Encrypt is commonly abused
        if (cert.issuer && cert.issuer.O && cert.issuer.O.includes("Let's Encrypt")) {
          signals.push({ name: 'Free SSL Certificate (Let\'s Encrypt)', weight: 10, severity: 'medium' });
        } else {
          signals.push({ name: 'Valid Extended SSL', weight: -10, severity: 'low', detail: `Issued by ${cert.issuer.O}` });
        }
      }
      socket.end();
      resolve();
    });
    
    socket.on('error', () => {
      signals.push({ name: 'SSL Connection Failed', weight: 25, severity: 'high' });
      resolve();
    });
    
    // Timeout
    setTimeout(() => {
      socket.destroy();
      resolve();
    }, 3000);
  });
}

async function performWhoisCheck(domain, signals) {
  try {
    const results = await whois(domain);
    let creationDate = results.creationDate || results.createdDate || results.creationdate || results.created;
    
    if (creationDate) {
      const created = new Date(creationDate);
      const ageInDays = (new Date() - created) / (1000 * 60 * 60 * 24);
      
      if (ageInDays < 30) {
        signals.push({ name: 'Newly Registered Domain (<30 days)', weight: 35, severity: 'critical', detail: `Age: ${Math.floor(ageInDays)} days` });
      } else if (ageInDays < 180) {
        signals.push({ name: 'Recent Domain Registration (<6 months)', weight: 15, severity: 'medium', detail: `Age: ${Math.floor(ageInDays)} days` });
      } else {
        signals.push({ name: 'Established Domain (>6 months)', weight: -10, severity: 'low', detail: `Age: ${Math.floor(ageInDays)} days` });
      }
    }
  } catch (err) {
    // WHOIS can fail or rate limit, we just ignore if it does
  }
}

async function performContentAnalysis(url, signals) {
  try {
    const response = await axios.get(url, { 
      timeout: 5000, 
      maxRedirects: 3,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PhishGuardBot/1.0)' }
    });
    
    const html = response.data;
    if (typeof html !== 'string') return;

    const $ = cheerio.load(html);
    
    // Check for password inputs
    const passwordInputs = $('input[type="password"]').length;
    if (passwordInputs > 0) {
      signals.push({ name: 'Contains Password Form', weight: 20, severity: 'high', detail: `Found ${passwordInputs} password input(s)` });
    }

    // Check title for brand impersonation
    const title = $('title').text().toLowerCase();
    const domain = getDomain(new URL(url).hostname);
    const impersonatedBrand = BRAND_NAMES.find(brand => title.includes(brand) && !domain.includes(brand));
    
    if (impersonatedBrand) {
      signals.push({ name: 'Title Brand Impersonation', weight: 40, severity: 'critical', detail: `Mimicking ${impersonatedBrand}` });
    }

    // Check for excessive external scripts
    const scriptSources = [];
    $('script[src]').each((_, el) => scriptSources.push($(el).attr('src')));
    if (scriptSources.length > 0) {
       const externalScripts = scriptSources.filter(src => src && src.startsWith('http') && !src.includes(domain));
       if (externalScripts.length > 5) {
         signals.push({ name: 'Excessive External Scripts', weight: 15, severity: 'medium' });
       }
    }

  } catch (err) {
    signals.push({ name: 'HTTP Content Fetch Failed', weight: 10, severity: 'medium', detail: err.message });
  }
}

// ─── Static Heuristics ────────────────────────────────────────────────────────

function applyStaticHeuristics(url, components, signals) {
  const hostname = components.hostname;
  const rawUrlLower = url.toLowerCase();

  // Keyword check
  const foundKws = PHISHING_KEYWORDS.filter(kw => rawUrlLower.includes(kw));
  if (foundKws.length > 0) {
    signals.push({ name: `Suspicious Keywords`, weight: Math.min(foundKws.length * 8, 30), severity: 'high', detail: foundKws.slice(0,3).join(', ') });
  }

  // Suspicious TLD
  const matchTld = SUSPICIOUS_TLDS.find(tld => hostname.endsWith(tld));
  if (matchTld) signals.push({ name: `Suspicious TLD (${matchTld})`, weight: 20, severity: 'high' });

  // URL Shortener
  const domain = getDomain(hostname);
  if (URL_SHORTENERS.includes(domain)) signals.push({ name: `URL Shortener Detected`, weight: 25, severity: 'high', detail: domain });

  // IP in hostname
  if (/^((\d{1,3}\.){3}\d{1,3})/.test(hostname)) signals.push({ name: 'Direct IP Address Usage', weight: 35, severity: 'critical' });

  // Protocol
  if (components.protocol === 'http:') signals.push({ name: 'Insecure Protocol (HTTP)', weight: 15, severity: 'medium' });

  // Length
  if (url.length > 100) signals.push({ name: 'Excessive URL Length', weight: 10, severity: 'medium' });
}

// ─── Main Analysis Function ───────────────────────────────────────────────────

/**
 * Analyse a URL actively and heuristically.
 * @param {string} rawUrl
 * @returns {Promise<object>} Analysis result
 */
async function analyseUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Invalid URL input');
  }

  const url = /^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `https://${rawUrl.trim()}`;
  const components = extractComponents(url);
  const signals = [];

  if (!components) {
    throw new Error('Could not parse URL');
  }

  // 1. Static Heuristics (Instant)
  applyStaticHeuristics(url, components, signals);

  // 2. Active Network Scans (Concurrent)
  // We wrap them in Promise.allSettled to ensure one failure doesn't crash the scan
  await Promise.allSettled([
    performDnsCheck(components.hostname, signals),
    components.protocol === 'https:' ? performSslCheck(components.hostname, signals) : Promise.resolve(),
    performWhoisCheck(getDomain(components.hostname), signals),
    performContentAnalysis(url, signals)
  ]);

  // Calculate raw score (base 10, min 0, max 100)
  const baseScore = 5;
  const rawScore = signals.reduce((sum, s) => sum + s.weight, baseScore);
  const score = Math.max(0, Math.min(100, rawScore));

  // Determine verdict
  let verdict;
  if (score < 35) verdict = 'SAFE';
  else if (score < 65) verdict = 'SUSPICIOUS';
  else verdict = 'PHISHING';

  // Derive risk level label
  const riskLevel =
    score < 20 ? 'Very Low' :
    score < 35 ? 'Low' :
    score < 55 ? 'Medium' :
    score < 75 ? 'High' : 'Critical';

  // Filter positive/negative signals for UI display
  const finalSignals = signals
    .filter(s => s.weight !== 0)
    .sort((a, b) => b.weight - a.weight);

  return {
    url,
    score,
    verdict,
    riskLevel,
    signals: finalSignals,
    components: {
      protocol: components.protocol,
      hostname: components.hostname,
    },
    analysedAt: new Date().toISOString(),
  };
}

module.exports = { analyseUrl };
