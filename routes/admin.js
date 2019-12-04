var express = require('express');
var router = express.Router();
var jwt = require('../common/jwt');
var admin = require('../common/global').admin;

router.post('/login', function (req, res, next) {
    if (!req.body.username) {
        res.error('用户名为空');
    } else if (!req.body.password) {
        res.error('密码为空');
    } else if (admin.username !== req.body.username
        || admin.password !== req.body.password) {
        res.error('用户名或密码错误');
    } else {
        res.return('登录成功', {
            token: jwt.generateToken({user: admin.username}),
            user: admin.username
        });
    }
});

module.exports = router;