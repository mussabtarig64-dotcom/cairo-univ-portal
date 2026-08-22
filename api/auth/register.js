const registerHandler = require('../register');

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(200).end();
    }

    if (typeof registerHandler === 'function') {
        return await registerHandler(req, res);
    } else if (registerHandler.default && typeof registerHandler.default === 'function') {
        return await registerHandler.default(req, res);
    }

    return res.status(500).json({ success: false, message: 'Invalid server handler' });
};