/**
 * Created by Administrator on 2018/5/9.
 */

var Comments = require('../models/Comment.js');

var CommentControl ={
    /**
     * 添加一条留言
     * @param req
     * @param res
     * @param next
     */
    insertComment :function(req,res,next){
        var articleId = req.fields.articleId,
            content = req.fields.content,
            author = req.session.user._id;

        var newComment = {
            article_id: articleId,
            content: content,
            time: new Date(),
            author: author,
            comments: []
        }
        new Comments(newComment).save(function(err,result){
            // 留言成功后跳转到上一页
            res.redirect('back');
        });
    },
    getComments: function(articleId){
        return Comments.find({article_id: articleId})
            .populate({path: 'author', select: {name: 1, _id: 1,avatar: 1}, model: 'User'})
            .sort({ _id: 1 })
            .exec();
    }
};


module.exports = CommentControl;