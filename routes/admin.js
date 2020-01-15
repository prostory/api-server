var express = require('express');
var router = express.Router();
var jwt = require('../common/jwt');
var admin = require('../common/global').admin;

router.post('/login', function (req, res, next) {
    if (!req.body.username) {
        res.error('Username is empty');
    } else if (!req.body.password) {
        res.error('Password is empty');
    } else if (admin.username !== req.body.username
        || admin.password !== req.body.password) {
        res.error('Wrong username or password');
    } else {
        res.return('Login successfully', {
            token: jwt.generateToken({user: admin.username}, 12),
            user: admin.username,
            expiry: 12
        });
    }
});

router.post('/check', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        res.return('Login successfully');
    });
});

module.exports = router;