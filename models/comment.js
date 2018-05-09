/**
 * Created by Administrator on 2018/5/9.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
/**
 * 文章评论集合
 * article_id: 文章的id
 * content: 评论内容
 * time: 评论时间
 * author: 评论的用户
 * comments: 回复集合
 * comments[x].content 回复内容
 * comments[x].time 回复时间
 * comments[x].from 发出回复的对象
 * comments[x].to 对评论回复的对象
 */

var ObjectId = mongoose.Schema.Types.ObjectId;

var commentsSchema = new Schema({
    article_id: {type : ObjectId, ref: 'Article'},
    content: String,
    time: Date,
    author: {type : ObjectId, ref: 'User'},
    comments: [{
        content:String,
        time:Date,
        from:{type: ObjectId, ref: 'User'},
        to:{type: ObjectId, ref: 'User'}
    }]
});

commentsSchema.index({ article_id: 1, _id: 1 })// 添加索引

var Comments = mongoose.model('Comments', commentsSchema);

module.exports = Comments;