// controllers/proxyController.js
const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config/config');
const { createHash } = require('crypto');

const cache = new NodeCache({ stdTTL: config.cacheTTL / 300 });

const getProxyData = async (req, res, next) => {
    try {
        const url = config.urlToProxy;
        const hashKey = createHash('md5').update(url).digest('hex').slice(0, 7); // Get first 7 characters of the hash
        const cachedData = cache.get(hashKey);

        if (cachedData) {
            console.log(`[${new Date().toISOString()}] Serving cached data for ${url}`);
            return res.json(cachedData);
        }

        const response = await axios.get(url);
        const responseData = response.data;

        // Cache the response for configured TTL with hash key
        cache.set(hashKey, responseData);

        console.log(`[${new Date().toISOString()}] Fetched fresh data for ${url}`);
        res.json(responseData);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProxyData,
};
