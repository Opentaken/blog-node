/**
 * Created by Administrator on 2018/5/3.
 */

var ArticleModel = require('../models/article.js');

var ArticleControl = {
    //添加文章
    create: function(req,res,next){
        var author = req.session.user._id,
            title = req.fields.title,
            content = req.fields.content;
        console.log(author);
        console.log(title);
        console.log(content);
        // 校验参数
        try {
            if (!author.length) {
                throw new Error('请登录');
            }
            if (!title.length) {
                throw new Error('请填写标题');
            }
            if (!content.length) {
                throw new Error('请填写文章内容');
            }
        } catch (e) {
            req.flash('error', e.message)
            return res.redirect('back')
        }

        //保存到数据库
        new ArticleModel({
            author: author,
            title: title,
            content: content,
            pv: 0
        }).save(function(err,result){
            if(err){
                req.flash('error',err.message);
                console.log(err)
                return res.redirect('/article/create');
            }else {
                console.log(result)
                return res.redirect('/article');
            }
        });

    }
}

module.exports = ArticleControl;