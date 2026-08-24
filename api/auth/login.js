const loginHandler = require('../login');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (typeof loginHandler === 'function') {
    return await loginHandler(req, res);
  } else if (loginHandler.default && typeof loginHandler.default === 'function') {
    return await loginHandler.default(req, res);
  }

  return res.status(500).json({ success: false, message: 'Invalid server handler' });
};
