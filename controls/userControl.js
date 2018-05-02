/**
 * Created by Administrator on 2018/5/2.
 */
var fs = require('fs');
var path = require('path');
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
            console.log(e);
            res.redirect('/users/signup');
        }
        new User({
            name: name,
            password: password,
            avatar: avatar,
            gender: gender,
            bio: bio
        }).save();
        res.redirect('/')
    }
}

module.exports = UserControl;