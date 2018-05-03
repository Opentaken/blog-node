/**
 * Created by Administrator on 2018/5/3.
 */
var express = require('express');
var router = express.Router();

var articleControl = require('../controls/articleControl.js');

router.get('/',articleControl.getList);

router.get('/create',function(req,res,next){
    res.render('articleCreate');
});

router.post('/create',articleControl.create);

router.get('/detail/:id',articleControl.getDetail);

module.exports = router;