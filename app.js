var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var indexRouter = require('./routes/index');
var path = require('path');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

// establish connection to mongodb
mongoose.connect('mongodb://localhost:27017/exshop', {useNewUrlParser: true});
var db = mongoose.connection;

require('./middleware/passport')(passport);

var app = express();

app.use(session({
    secret: 'secret',
    store: new MongoStore({
        url: 'mongodb://localhost:27017/sessiondb'
    }),
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// passport initialize and session build
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

app.use('/', indexRouter);
app.get('/*', (req, res) => res.redirect('/'));


module.exports = app;
