// controllers/proxyController.js
const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config/config');
const { createHash } = require('crypto');

const cache = new NodeCache({ stdTTL: config.cacheTTL  });

const getProxyData = async (req, res, next) => {
    try {
    
        const url = config.urlToProxy;
        const hashh = createHash('md5').update(url).digest('hex'); 
        const buff = Buffer.from(hashh);
        const hashKey = buff.toString('base64');

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
