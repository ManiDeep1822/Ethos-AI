const https = require('https');
const http = require('http');

/**
 * Render free tier spins down idle apps after 15 minutes.
 * This script pings the application's own URL every 14 minutes to prevent a cold start.
 */
const startKeepAlive = () => {
  // 14 minutes in milliseconds
  const PING_INTERVAL = 14 * 60 * 1000; 
  
  // The live Render URL should be added to the environment variables
  const url = process.env.RENDER_EXTERNAL_URL;

  if (!url) {
    console.warn('⚠️ [Keep-Alive]: RENDER_EXTERNAL_URL is not set in your Render environment variables. The automatic ping will not run, and the server may sleep.');
    return;
  }

  // Determine which protocol to use
  const protocol = url.startsWith('https') ? https : http;

  console.log(`🚀 [Keep-Alive]: Initialized. Pinging ${url} every 14 minutes.`);

  setInterval(() => {
    protocol.get(url, (res) => {
      console.log(`✅ [Keep-Alive]: Successfully pinged self. Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`❌ [Keep-Alive]: Failed to ping self:`, err.message);
    });
  }, PING_INTERVAL);
};

module.exports = startKeepAlive;
