var express = require('express');
var router = express.Router();
var jwt = require('../common/jwt');
var Site = require('../models/site');

router.get('/', function (req, res, next) {
    Site.findAll(function (err, result) {
        if (err) {
            res.error('查询失败', err);
        } else {
            res.return('查询成功', result);
        }
    })
});

router.post('/', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        if (!req.body.name) {
            res.error('名称为空');
        } else if (!req.body.address) {
            res.error('地址为空');
        } else if (!req.body.long || !req.body.lat) {
            res.error('经纬度为空');
        } else {
            var site = new Site({
                name: req.body.name,
                address: req.body.address,
                long: req.body.long,
                lat: req.body.lat
            });
            site.save(function (err, result) {
                if (result) {
                    res.return('创建成功', result);
                } else {
                    res.error('创建失败');
                }
            });
        }
    });
});

router.put('/:id', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        if (!req.body.name) {
            res.error('名称为空');
        } else if (!req.body.address) {
            res.error('地址为空');
        } else if (!req.body.long || !req.body.lat) {
            res.error('经纬度为空');
        } else {
            Site.updateInfo(req.params.id, {
                name: req.body.name,
                address: req.body.address,
                long: req.body.long,
                lat: req.body.lat
            }, function (err, result) {
                if (result) {
                    res.return('更新成功', result);
                } else {
                    res.error('更新失败');
                }
            });
        }
    });
});

router.delete('/:id', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        Site.deleteById(req.params.id, function (err, result) {
            if (result) {
                res.return('删除成功', result);
            } else {
                res.error('删除失败');
            }
        });
    });
});

module.exports = router;