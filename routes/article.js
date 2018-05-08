/**
 * Created by Administrator on 2018/5/3.
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');//时间格式化组件

var articleControl = require('../controls/articleControl.js');

router.get('/',articleControl.getList);

router.get('/create',function(req,res,next){
    res.render('articleCreate');
});

router.post('/create',articleControl.create);

router.get('/detail/:id',function(req,res,next){
    var id = req.params.id;
    Promise.all([
        articleControl.getDetailById(id),
        articleControl.updatePvByArticle(id)
    ]).then(function(result){
        var detail = result[0];
        var articleDetail = {
            title: detail.title,
            content: detail.content,
            publishDate: moment(detail.publishDate).format('YYYY-MM-DD HH:mm:ss'),
            pv:detail.pv,
            author: detail.author.name,
            authorId: detail.author._id
        }
        res.render('articleDetail',{ detail: articleDetail });
    }).catch(next);
});

module.exports = router;