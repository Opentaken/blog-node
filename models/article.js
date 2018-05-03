/**
 * Created by Administrator on 2018/5/3.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
/**
 * author: 作者的id
 * title: 文章标题
 * content: 文章内容
 * pv: 点击量
 */

var ObjectId = mongoose.Schema.Types.ObjectId;

var articleSchema = new Schema({
    author: ObjectId,
    title: String,
    content: String,
    pv: Number
});

//articleSchema.index({ title: 1 }, { unique: true })// 添加索引

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;