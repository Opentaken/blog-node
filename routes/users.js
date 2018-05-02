var express = require('express');
var router = express.Router();

var UserControl = require('../controls/userControl.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册
router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.post('/signup', UserControl.signUp);

//登录

router.get('/signin', function (req, res, next) {
  res.render('signin');
});

router.get('/signiny', function (req, res, next) {
  res.render('signin');
});

router.post('/signin', UserControl.signIn);

module.exports = router;
