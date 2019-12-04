var express = require('express');
var router = express.Router();
var jwt = require('../common/jwt');
var Phone = require('../models/phone');

router.get('/', function (req, res, next) {
    Phone.findAll(function (err, result) {
        if (err) {
            res.error('查询失败', err);
        } else {
            res.return('查询成功', result);
        }
    })
});

router.get('/:id', function (req, res, next) {
    Phone.findById(req.params.id, function (err, result) {
        if (result) {
            res.return('查询成功', result);
        } else {
            res.error('查询失败');
        }
    });
});

router.get('/:brand/:model', function (req, res, next) {
    Phone.findByBrandAndModel(req.params.brand, req.params.model, function (err, result) {
        if (result) {
            res.return('查询成功', result);
        } else {
            res.error('查询失败');
        }
    });
});

router.post('/', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        if (!req.body.brand) {
            res.error('品牌为空');
        } else if (!req.body.model) {
            res.error('型号为空');
        } else {
            var phone = new Phone({
                brand: req.body.brand,
                model: req.body.model,
                appearance: req.body.appearance,
                publish: req.body.publish,
                published: req.body.published,
                warranty_duration: req.body.warranty_duration
            });
            phone.save(function (err, result) {
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
        if (!req.body.brand) {
            res.error('品牌为空');
        } else if (!req.body.model) {
            res.error('型号为空');
        } else {
            Phone.updateInfo(req.params.id, req.body, function (err, result) {
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
        Phone.deleteById(req.params.id, function (err, result) {
            if (result) {
                res.return('删除成功', result);
            } else {
                res.error('删除失败');
            }
        });
    });
});

module.exports = router;