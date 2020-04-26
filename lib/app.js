"use strict";

var express = require('express');

var session = require('express-session');

var MongoStore = require('connect-mongo')(session);

var passport = require('passport');

var mongoose = require('mongoose');

var indexRouter = require('../routes/index');

var path = require('path'); // var cookieParser = require('cookie-parser');


var bodyParser = require('body-parser');

var logger = require('morgan');

var _require = require('./paths'),
    BUILD_DIR = _require.BUILD_DIR,
    PUBLIC_DIR = _require.PUBLIC_DIR;

var reactRenderer = require('./react-renderer'); // establish connection to mongodb


mongoose.connect('mongodb://localhost:27017/exshop', {
  useNewUrlParser: true
});
var db = mongoose.connection;

require('../middleware/passport')(passport);

var app = express();
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*'); // Request methods you wish to allow

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Request headers you wish to allow

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)

  res.setHeader('Access-Control-Allow-Credentials', true); // Pass to next layer of middleware

  next();
});
app.use(session({
  secret: 'secret',
  store: new MongoStore({
    url: 'mongodb://localhost:27017/sessiondb'
  }),
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 1 day

  }
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
})); // passport initialize and session build

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', indexRouter);
app.get('/', reactRenderer);
app.use(express["static"](BUILD_DIR));
app.use(express["static"](PUBLIC_DIR));
module.exports = app;