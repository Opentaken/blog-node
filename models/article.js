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

articleSchema.index({ title: -1 })// 添加索引
articleSchema.statics = {
    fetch:function(id, cb) {
        if (id) {
            return this.find({'_id': {"$lt": id}})
                .limit(10)
                .sort({'_id':-1})
                .exec(cb);
        }else {
            return this.find({})
                .limit(10)
                .sort({'_id':-1})
                .exec(cb);
        }

    }
}
var Article = mongoose.model('Article', articleSchema);


module.exports = Article;