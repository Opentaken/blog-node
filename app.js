var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var logger = require('morgan');
var fs = require('fs');
var ejsMate = require('ejs-mate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');
var commentRouter = require('./routes/comment');
const config = require('./config')

var app = express();

if (!fs.existsSync(__dirname+'/logs')) {
    console.log("创建日志文件夹")
    fs.mkdirSync(__dirname+'/logs');
}
if (!fs.existsSync(__dirname+'/public/img')) {
    console.log("创建图片文件夹")
    fs.mkdirSync(__dirname+'/public/img');
}

//log
var accessLogStream = fs.createWriteStream(__dirname+'/logs/access.log',{flags:'a'});
app.use(logger('combined',{stream:accessLogStream}));//将日志写入文件


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-mate'));
app.locals._layoutFile = 'layout/layout-body.ejs';

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

//注入flash
app.use(flash());

/**
 * 数据库链接
 */

var mongoose = require('mongoose');
var opts = {
    server: {
        socketOptions: {keepAlive: 1}
    }
};
switch (app.get('env')){
    case 'development':
        mongoose.connect(config.mongo.development.connectionString ,opts);
        /**
         * 连接成功
         */
        mongoose.connection.on('connected', function () {
            console.log('Mongoose connection  success');
        });

        /**
         * 连接异常
         */
        mongoose.connection.on('error',function (err) {
            console.log('Mongoose connection error: ' + err);
        });

        /**
         * 连接断开
         */
        mongoose.connection.on('disconnected', function () {
            console.log('Mongoose connection disconnected');
        });
        mongoConnectionString = config.mongo.development.connectionString;
        break;
    case 'production':
        mongoose.connect(config.mongo.production.connectionString, opts);
        mongoConnectionString = config.mongo.production.connectionString;
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
    keepExtensions: true// 保留后缀
}));

//操作会话中间件
app.use(function(req, res, next){
    if(!res.locals.user && !req.session.user){
        res.locals.user = null;
    }else if(!res.locals.user && req.session.user){
        res.locals.user = req.session.user;
    }
     //如果有即显消息，把它传到上下文中，然后清除它
     res.locals.flash = req.session.flash;
     delete req.session.flash;
     next();
 });

//通过路径区分路由文件
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/article',articleRouter);
app.use('/comment',commentRouter);


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
   return res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
