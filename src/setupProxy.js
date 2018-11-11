const proxy = require('http-proxy-middleware');

const MindSphereRegion = process.env.MDSP_Region || "eu1";
const MindSphereTenant = process.env.MDSP_Tenant;
const MindSphereKeyManagerUser = process.env.MDSP_KEYMANANGER_USER;
const MindSphereKeyManagerPassword = process.env.MDSP_KEYMANANGER_PASSWORD;
const MindSphereToken = process.env.MDSP_BEARER;

// store tenantToken
let tenantToken = null;

/**
 * Custom authorization injection middleware for local development.
 * Requires the following environment variables to be set:
 *  - MDSP_TENANT
 *  - MDSP_KEYMANAGER_USER
 *  - MDSP_KEYMANAGER_PASSWORD
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function injectToken(req, res, next) {
  if(req.originalUrl && req.originalUrl.startsWith("/api")) {
    console.log('Time:', Date.now(), req.originalUrl);
    // ToDo: check current token and if it is still valid
    // if token is not valid, get new one

    req.headers['authorization'] = MindSphereToken;
  }
  
  next()
}

/**
 * This custom express.js middleware proxies all relative requests to /api/* to https://gateway.<region>.mindsphere.io/api/*.
 * In addition, it requests for the specified tenant a valid token and injects it into the request. This enables to develop locally
 * w/o pushing the app to Cloud Foundry or registering it in via the Developer Cockpit.
 *
 * @param {Application} app - express application delivering frontend
 */
module.exports = function(app) {
  app.use(injectToken, proxy('/api', { target: `https://gateway.${MindSphereRegion}.mindsphere.io`, changeOrigin: true, secure: false}));
};