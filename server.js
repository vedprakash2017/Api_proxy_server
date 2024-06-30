// server.js
const express = require('express');
const NodeCache = require('node-cache');
const config = require('./config/config');

const app = express();

// Initialize a cache for request counts
const requestCounts = new NodeCache({ stdTTL: config.rateLimitWindowMs }); // TTL in seconds


// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip;
    
    // Increment request count for this IP
    let count = requestCounts.get(ip) || 0;
    requestCounts.set(ip, count + 1 ); // Reset TTL on each access

    console.log(`${config.rateLimitWindowMs}`)

    // Determine rate limit status based on request count
    const rateLimitStatus = count >= config.rateLimitMaxRequests ? 'Rate limit exceeded' : 'OK';

    console.log(`[${timestamp}] Request from ${ip}: ${req.method} ${req.url} - Rate limit status: ${rateLimitStatus}`);
    next();
});

// Rate limiting middleware (optional for demonstration, not enforced)
const limiter = (req, res, next) => {
    const ip = req.ip;
    const count = requestCounts.get(ip) || 0;

    if (count > config.rateLimitMaxRequests) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    next();
};

// Apply rate limiting middleware globally
app.use('/api', limiter);


// Proxy route
const proxyRoutes = require('./routes/proxyRoutes');
app.use('/api', proxyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
