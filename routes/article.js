/**
 * Created by Administrator on 2018/5/3.
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');//时间格式化组件

var articleControl = require('../controls/articleControl.js');
var commentControl = require('../controls/commentControl.js');

router.get('/',articleControl.getList);

router.get('/create',function(req,res,next){
    res.render('articleCreate');
});

router.post('/create',articleControl.create);

router.get('/detail/:id',function(req,res,next){
    var id = req.params.id;
    Promise.all([
        articleControl.getDetailById(id),
        commentControl.getComments(id),
        articleControl.updatePvByArticle(id)
    ]).then(function(result){
        var detail = result[0];
        var comments = result[1].map(function(comment){
            return{
                id: comment._id,
                author:comment.author,
                content: comment.content,
                time: moment(comment.time).format('YYYY-MM-DD HH:mm:ss'),
                comments:comment.comments
            }
        });
        console.log(comments)
        var articleDetail = {
            id: detail._id,
            title: detail.title,
            content: detail.content,
            publishDate: moment(detail.publishDate).format('YYYY-MM-DD HH:mm:ss'),
            pv:detail.pv,
            author: detail.author.name,
            authorId: detail.author._id,
        }
        res.render('articleDetail',{ detail: articleDetail ,comments: comments});
    }).catch(next);
});

module.exports = router;