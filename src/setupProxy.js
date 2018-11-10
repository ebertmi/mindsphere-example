const proxy = require('http-proxy-middleware');

const MindSphereRegion = process.env.MDSP_Region || "eu1";

module.exports = function(app) {
  // ToDo: automatically inject credentials
  app.use(proxy('/api', { target: `https://gateway.${MindSphereRegion}.mindsphere.io`, changeOrigin: true, secure: false }));
};