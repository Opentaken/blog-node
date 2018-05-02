/**
 * Created by Administrator on 2018/5/2.
 */
var fs = require('fs');
var path = require('path');
//引入bcrypt模块
var bcrypt = require('bcrypt');
var User = require('../models/user.js');
var UserControl = {
    signUp: function(req, res, next){
        var name = req.fields.name,
            gender = req.fields.gender,
            bio = req.fields.bio,
            avatar = req.files.avatar.path.split(path.sep).pop(),
            password = req.fields.password,
            repassword = req.fields.repassword;

        //校验参数
        try{
            if (!(name.length >= 1 && name.length <= 10)) {
                throw new Error('名字请限制在 1-10 个字符')
            }
            if (['m', 'f', 'x'].indexOf(gender) === -1) {
                throw new Error('性别只能是 m、f 或 x')
            }
            if (!(bio.length >= 1 && bio.length <= 30)) {
                throw new Error('个人简介请限制在 1-30 个字符')
            }
            if (!req.files.avatar.name) {
                throw new Error('缺少头像')
            }
            if (password.length < 6) {
                throw new Error('密码至少 6 个字符')
            }
            if (password !== repassword) {
                throw new Error('两次输入密码不一致')
            }
        }catch (e){
            // 注册失败，异步删除上传的头像
            if(req.files.avatar.name){
                fs.unlink(req.files.avatar.path);
            }
            req.flash('error', e.message);
            res.redirect(303,'/users/signup');
        }

        //生成salt的迭代次数
        var saltRounds = 10;
        //随机生成salt
        var salt = bcrypt.genSaltSync(saltRounds);
        //获取hash值
        var hash = bcrypt.hashSync(password, salt);
        //把hash值赋值给password变量
        password = hash;

        try{
            //插入到数据库
            new User({
                name: name,
                password: password,
                avatar: avatar,
                gender: gender,
                bio: bio
            }).save(function(err,result){
                if(err){
                    //console.log(err)
                    // 注册失败，异步删除上传的头像
                    fs.unlink(req.files.avatar.path)
                    // 用户名被占用则跳回注册页，而不是错误页
                    if (err.message.match('duplicate key')) {
                        req.flash('error', '用户名已被占用');
                        //return res.redirect('/users/signup');
                    }
                    next();
                }else {
                    // 此 user 是插入 mongodb 后的值，包含 _id
                    user = result;
                    // 删除密码这种敏感信息，将用户信息存入 session
                    delete user.password;
                    req.session.user = user;
                    // 写入 flash
                    req.flash('success', '注册成功');
                    // 跳转到首页
                    res.redirect(303,'/');
                }

            });


        }catch (e){

        }

    },
    //登录
    signIn: function(req,res,next){
        var name = req.files.name,
            password = req.files.password;
        console.log(name)
        console.log(password)
        User.findOne({name:name},function(err,result){
            var user = result;
            var pwdMatchFlag =bcrypt.compareSync(password, user.password);
            if(pwdMatchFlag){
                // 删除密码这种敏感信息，将用户信息存入 session
                delete user.password;
                req.session.user = user;
                //写入flash
                req.flash('success', '登录成功');
                res.redirect(303,'/');
            }else {
                req.flash('error', '用户名或密码错误');
                res.redirect(303,'/users/signin');
            }
        })
    }
}

module.exports = UserControl;