// config/config.js
require('dotenv').config();

module.exports = {
    rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS || 60000, // 1 minute
    rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 5,
    cacheTTL: process.env.CACHE_TTL || 300, // Cache TTL in seconds (5 minutes)
    urlToProxy: process.env.URL_TO_PROXY || 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m', // Default URL to proxy
};
