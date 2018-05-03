/**
 * Created by Administrator on 2018/5/3.
 */

var ArticleModel = require('../models/article.js');
var User = require('../models/user.js');
var moment = require('moment');//时间格式化组件
/**
 * 截取内容返回描述
 * @param content
 * @returns {string}
 */
function getDescription(content){
    var description = '';
    if(content.length>50){
        description = content.substr(0,50) + '...';
    }else {
        description = content;
    }
    return description;
}

var ArticleControl = {
    //添加文章
    create: function(req,res,next){
        var author = req.session.user._id,
            title = req.fields.title,
            content = req.fields.content;
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
            req.flash('error', e.message);
            return res.redirect('back');
        }

        //保存到数据库
        new ArticleModel({
            author: author,
            title: title,
            content: content,
            pv: 0,
            publishDate: new Date()
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

    },

    //文章列表
    getList: function(req,res,next){
        var id = req.query.id || null;
        ArticleModel.count({},function(err,count){
            ArticleModel.fetch(id,function(err,result){
                if(err){
                    next(err);
                }else {
                    //整合数据
                    var articles = result.map(function(item){
                        return {
                            id: item._id,
                            title: item.title,
                            content: getDescription(item.content)
                        }
                    });
                    res.render('articleList',{ title: '文章列表', articles: articles, count: count });
                }
            })
        });
    },

    //文章详情
    getDetail: function(req,res,next){
        var id = req.params.id;
        try{
            if(!id){
                throw new Error('没有文章id');
            }
        }catch (e){
            req.flash('error', e.message);
            return res.redirect('back');
        }
        ArticleModel.findOne({_id: id},function(err,detail){
            if(err){
                return res.redirect('back');
            }else {
                User.findOne({_id: detail.author},function(err,user){
                    if(err){
                        return res.redirect('back');
                    }else {
                        var articleDetail = {
                            title: detail.title,
                            content: detail.content,
                            publishDate: moment(detail.publishDate).format('YYYY-MM-DD HH:mm:ss'),
                            author: user.name
                        }
                        res.render('articleDetail',{ detail: articleDetail });
                    }
                });
            }

        });

    }

}

module.exports = ArticleControl;