var jwt = require('jsonwebtoken');
var config = require('config');

const express = require('express');
const app = express();
const Worker = require('./generator');

// Middleware for checking the jwt token
/*app.use('/', function (req, res, next) {
  const authorizationHeader = req.headers['authorization'];
  const scopes = [];

  if (authorizationHeader != null) {
    scopes = jwt.decode(authorizationHeader).scopes;
  }

  if (scopes.includes(`${config.mdsp.appname}.${config.mdsp.scope}`)) {
    console.log("request with valid application token")
  } else {
    console.log("unauthorized request");
  }

  next();
});*/

app.get('/', function (req, res) {
  res.send('response');
});


app.listen(3001, () => console.log('Backend app listening on port 3001!'));