const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressHBS = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const { check, validationResult } = require('express-validator');
const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb://localhost:27017/shopping', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHBS({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');

// middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'mynameisdug',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // Make available to the view files in my application
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

// Order is important for these routes.  Home route '/' should go last
app.use('/user', userRoutes);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
