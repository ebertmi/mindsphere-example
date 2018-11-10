const proxy = require('http-proxy-middleware');

const MindSphereRegion = process.env.MDSP_Region || "eu1";
const MindSphereTenant = process.env.MDSP_Tenant;
const MindSphereKeyManagerUser = process.env.MDSP_KEYMANANGER_USER;
const MindSphereKeyManagerPassword = process.env.MDSP_KEYMANANGER_PASSWORD;

let tenantToken = null;

function injectToken(req, res, next) {
  if(req.originalUrl && req.originalUrl.startsWith("/api")) {
    console.log('Time:', Date.now(), req.originalUrl);
    // ToDo: check current token and if it is still valid
    // if token is not valid, get new one

    req.setHeader('Authorization', 'TODO_GET_BEARER');
  }
  
  next()
}

module.exports = function(app) {
  // ToDo: automatically inject credentials
  app.use(injectToken, proxy('/api', { target: `https://gateway.${MindSphereRegion}.mindsphere.io`, changeOrigin: true, secure: false}));
};