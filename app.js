var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars')


var app = express();

var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv').load();

var flash = require('connect-flash');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passport.initialize());
app.use(passport.session());

//////////////////////MODELS/////////////////////////////
var models = require("./app/models");

//Sync Database
models.sequelize.sync().then(function() {
  console.log('Se conecto a la bd')
}).catch(function(err) {
  console.log(err, "Something went wrong with the Database Update!")
});



////////////////////////VISTAS///////////////////////////
app.set('views', path.join(__dirname, './app/views'));
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');
var authRoute = require('./app/routes/index.js')(app,passport);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//load passport strategies
require('./config/passport/passport.js')(passport,models.cuenta, models.persona, models.rol);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
