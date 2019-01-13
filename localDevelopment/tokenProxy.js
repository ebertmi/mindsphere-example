function fetchToken(tmClient, tmSecret, hostTenant, userTenant) {

}

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
  if (req.originalUrl && req.originalUrl.startsWith("/api")) {
    console.log('Time:', Date.now(), req.originalUrl);
    // ToDo: check current token and if it is still valid
    // if token is not valid, get new one

    // Currently the configured Bearer token will be injected until the Technical Token Manager API has been released
    req.headers['authorization'] = MindSphereToken;
  }

  if (req.originalUrl && req.originalUrl.startsWith(BACKEND_BASE_PATH)) {
    req.headers['authorization'] = MindSphereToken; 
  }
  
  next()
}

module.exports = {
  injectToken
}