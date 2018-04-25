module.exports = {
  isRedis: false,//是否使用redis保存session
  RedisOptions: {
    host: '127.0.0.1', //redis数据库地址
    port: '6379', //redis数据库端口
    pass: '', //redis数据库密码
    db: 1, //redis数据库索引，默认 0
    logErrors: true //redis错误打印
  }
}