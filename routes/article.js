/**
 * Created by Administrator on 2018/5/3.
 */
var express = require('express');
var router = express.Router();

var articleControl = require('../controls/articleControl.js');

router.get('/',function(req,res,next){
    res.render('articleList');
});

router.get('/create',function(req,res,next){
    res.render('articleCreate');
});

router.post('/create',articleControl.create);

module.exports = router;