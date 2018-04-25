var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const config = require('./config')

var app = express();

//log
var accessLogStream = fs.createWriteStream(__dirname+'/logs/access.log',{flags:'a'});
app.use(logger('combined',{stream:accessLogStream}));//将日志写入文件


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
//配置session
if(config.isRedis){
  app.use(session({
      store: new RedisStore(config.RedisOptions),
      secret: 'secret-key',
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 60 * 60 * 1000 }
  }));
}else{
  app.use(session({
    secret: '11',  //用来注册session id 到cookie中，相当与一个密钥。
    name: 'secret-key',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: { maxAge: 60 * 60 * 1000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: true,
    saveUninitialized: true,
  }));
}


//通过路径区分路由文件
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
