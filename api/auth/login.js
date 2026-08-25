// معالج مسار /api/auth/login لمنصة Vercel Serverless
const app = require('../../server/server');

module.exports = (req, res) => {
  return app(req, res);
};
