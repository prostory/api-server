var express = require('express');
var router = express.Router();
var jwt = require('../common/jwt');
var Phone = require('../models/phone');
var Instruction = require('../models/instruction');
var crypto = require('crypto');


/**
 * 返回所有电子说明书
 */
router.get('/', function (req, res, next) {
    Instruction.findAll(function (err, result) {
        if (err) {
            res.error('Query failed', err);
        } else {
            res.return('Query successfully', result);
        }
    });
});

/**
 * 返回指定id的手机的电子说明书
 */
router.get('/items/:id', function (req, res, next) {
    Instruction.findItemById(req.params.id, function (err, result) {
        if (result) {
            res.return('Query successfully', result.items.id(req.params.id));
        } else {
            res.error('Query result does not exist');
        }
    })
});

/**
 * 返回指定id的手机的电子说明书
 */
router.get('/phones/:id', function (req, res, next) {
    Instruction.findByPhoneId(req.params.id, function (err, result) {
        if (result) {
            res.return('Query successfully', result);
        } else {
            res.error('Query result does not exist');
        }
    })
});

/**
 * 返回指定brand和model手机的电子说明书
 */
router.get('/phones/:brand/:model', function (req, res, next) {
    Phone.findByBrandAndModel(req.params.brand, req.params.model, function (err, result) {
        if (result) {
            Instruction.findByPhoneId(result._id, function (err, result) {
                if (err) {
                    res.error('Query failed', err);
                } else {
                    res.return('Query successfully', result);
                }
            });
        } else {
            res.error('Phone is not exist');
        }
    });
});

/**
 * 返回指定语言的brand和model手机的电子说明书
 */
router.get('/phones/:brand/:model/:lang', function (req, res, next) {
    Phone.findByBrandAndModel(req.params.brand, req.params.model, function (err, result) {
        if (result) {
            Instruction.findByPhoneId(result._id, function (err, result) {
                if (result.length > 0) {
                    var languages = result.map(function (t) {
                        return t.lang
                    });
                    var index = languages.indexOf(req.params.lang)
                    if (index < 0) {
                        index = languages.indexOf('en')
                    }
                    if (index < 0) {
                        index = 0
                    }
                    res.return('Query successfully', result[index]);
                } else {
                    res.error('Instruction is not exist');
                }
            });
        } else {
            res.error('Phone is not exist');
        }
    });
});

/**
 * 创建电子说明书
 */
router.post('/', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        if (!req.body.phone_id) {
            res.error('Phone id is empty');
        } else if (!req.body.lang) {
            res.error('Language is empty');
        } else if (!req.body.title) {
            res.error('Title is empty');
        } else if (!req.body.description) {
            res.error('Description is empty');
        } else {
            Phone.findById(req.body.phone_id, function (err, result) {
                if (result) {
                    var md5 = crypto.createHash('md5');
                    var instruction = new Instruction({
                        unique: md5.update(req.body.phone_id.toString() + req.body.lang).digest('hex'),
                        phone_id: req.body.phone_id,
                        lang: req.body.lang,
                        title: req.body.title,
                        description: req.body.description,
                        banners: req.body.banners,
                        items: req.body.items
                    });
                    instruction.save(function (err, result) {
                        if (err) {
                            res.error('Create failed', err);
                        } else {
                            res.return('Create successfully', result);
                        }
                    });
                } else {
                    res.error('Phone is not exist');
                }
            });
        }
    });
});

/**
 * 更新指定id的电子说明书
 */
router.put('/:id', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        if (!req.body.phone_id) {
            res.error('Phone id is empty');
        } else if (!req.body.lang) {
            res.error('Language is empty');
        } else if (!req.body.title) {
            res.error('Title is empty');
        } else if (!req.body.description) {
            res.error('Description is empty');
        } else {
            Phone.findById(req.body.phone_id, function (err, result) {
                if (result) {
                    var data = Object.assign({}, req.body);
                    var md5 = crypto.createHash('md5');
                    data.unique = md5.update(req.body.phone_id.toString() + req.body.lang).digest('hex');
                    Instruction.updateInfo(req.params.id, data, function (err, result) {
                        if (err) {
                            res.error('Update failed', err);
                        } else {
                            res.return('Update successfully', result);
                        }
                    });
                } else {
                    res.error('Phone is not exist');
                }
            });
        }
    });
});

/**
 * 删除指定id的电子说明书
 */
router.delete('/:id', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        Instruction.deleteById(req.params.id, function (err, result) {
            if (err) {
                res.error('Delete failed', err);
            } else {
                res.return('Delete successfully', result);
            }
        });
    });
});

module.exports = router;