const express = require('express');
const session = require('express-session');

const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const db = require('./db.js');
const routes = require('./routes/index');
var logger = require('morgan');
const log4js = require('log4js');

const app = express();

log4js.configure({
  appenders: {
    ruleConsole:
			{
			  type: 'console',
			},
    ruleFile: {
      type: 'dateFile',
      filename: 'logs/server-',
      pattern: 'yyyy-MM-dd.log',
      maxLogSize: 10 * 1000 * 1000,
      numBackups: 3,
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: {
      appenders: ['ruleConsole', 'ruleFile'],
      level: 'trace',
    },
  },
});
var logger = log4js.getLogger('log4jslog');
app.use(log4js.connectLogger(logger, { level: 'auto' }));// uncomment after placing your favicon in /public

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(cookieParser());
app.use(session({
  name: 'blog.sid',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: '5A16C79BDE24BCFF',
}));

// 静态文件目录
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../../resource')));

app.use((req, res, next) => {
  if (req.session.record || req.url === '/get-navside-info') {
    next();
  } else {
    req.session.record = true;
    db.query("update config set value = value + 1 where name = 'view_count'", (err, rows) => {
      next();
    });
  }
});

app.use('/', routes);

// development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    logger.info(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler no stacktraces leaked to user
app.use((err, req, res, next) => {
  logger.info(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
