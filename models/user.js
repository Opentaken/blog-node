/**
 * Created by Administrator on 2018/5/2.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
/*
 *name 用户名,
 *password 密码,
 *avatar 头像,
 *gender 性别,
 *bio 简介
* */
var userSchema = new Schema({
    name: String,
    password: String,
    avatar: String,
    gender: String,
    bio: String
});
userSchema.index({ name: 1 }, { unique: true })// 添加索引

var User = mongoose.model('User', userSchema);



module.exports = User;