var express = require('express');
var router = express.Router();

var UserControl = require('../controls/userControl.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function (req, res, next) {
  res.render('signup')
});

router.post('/signup', UserControl.signUp);

module.exports = router;
