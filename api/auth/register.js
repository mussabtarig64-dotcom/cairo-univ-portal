// معالج مسار /api/auth/register لمنصة Vercel Serverless
const app = require('../../server/server');

module.exports = (req, res) => {
  return app(req, res);
};