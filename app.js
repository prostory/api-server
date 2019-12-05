var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');
var adminRouter = require('./routes/admin');
var sitesRouter = require('./routes/sites');
var phonesRouter = require('./routes/phones');
var warrantiesRouter = require('./routes/warranties');
var instructionsRouter = require('./routes/instructions');

var responseHandler = require('./middlewares/response_handler');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(responseHandler);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 允许跨域
app.all('/api/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","content-type");
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() === 'options')
        res.sendStatus(200);
    else
        next();
});

app.use('/api', express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/public/upload', uploadRouter);

// after sale system
app.use('/api/after-sale/admin', adminRouter);
app.use('/api/after-sale/sites', sitesRouter);
app.use('/api/after-sale/phones', phonesRouter);
app.use('/api/after-sale/warranties', warrantiesRouter);
app.use('/api/after-sale/instructions', instructionsRouter);

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
