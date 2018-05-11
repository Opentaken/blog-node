/**
 * Created by Administrator on 2018/5/9.
 */
var express = require('express');
var router = express.Router();
var moment = require('moment');//时间格式化组件

var commentControl = require('../controls/commentControl.js');

router.post('/',commentControl.insertComment);
router.post('/:id',commentControl.insertSubComment);

module.exports = router;