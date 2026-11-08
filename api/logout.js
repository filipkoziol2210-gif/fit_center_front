const { proxyToDjango } = require("../lib/djangoProxy");

module.exports = async function handler(req, res) {
  return proxyToDjango(req, res);
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
