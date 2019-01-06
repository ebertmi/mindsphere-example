var jwt = require('jsonwebtoken');
var config = require('config');

const express = require('express');
const app = express();

// Middleware for checking the jwt token
app.use('/', function (req, res, next) {
  const authorizationHeader = req.headers['authorization'];
  let scopes = [];
  let decoded;
  let authInfo = {};

  if (authorizationHeader != null) {
    decoded = jwt.decode(authorizationHeader);

    // Include here check for exp and iata
  }

  if (decoded != null && 
    Array.isArray(decoded.scopes) &&
    decoded.scopes.includes(`${config.mdsp.appName}.${config.mdsp.scope}`)) {
    
    authInfo.scopes = decoded.scopes;
    authInfo.isAuthorized = true;
    authInfo.userName = decoded.user_name;
    authInfo.email = decoded.email;
    authInfo.userId = decoded.user_id;
    authInfo.userTenant = decoded.ten;
    authInfo.userSubtenant = decoded.subtenant; // ToDo: check default value and reject if application does not support subtenancy

    console.log("request with valid application token")
  } else {
    console.log("unauthorized request");
    // Unauthorized user
    authInfo.scopes = [];
    authInfo.isAuthorized = false;
  }

  // Set information in res.locals.authentication to allow handlers to access the information
  res.locals.auth = authInfo

  next();
});

app.get('/me', function (req, res) {
  // ToDo: Middleware should add context information
  const response = {};

  if (res.locals.auth && res.locals.auth.isAuthorized === true) {
    response.userName = res.locals.auth.userName;
    response.userTenant = res.locals.auth.userTenant;
    res.send(response);
  } else {
    // Not authorized --> send error message
    response.errorMessage = 'Not authorized.';
    res.send(401, response);
  }
});

module.exports = app;
