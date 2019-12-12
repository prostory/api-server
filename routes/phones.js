var express = require('express');
var router = express.Router();
var jwt = require('../common/jwt');
var Phone = require('../models/phone');
var Warranty = require('../models/warranty');
var Instruction = require('../models/instruction');
var crypto = require('crypto');

router.get('/', function (req, res, next) {
    Phone.findAll(function (err, result) {
        if (err) {
            res.error('Query failed', err);
        } else {
            res.return('Query successfully', result);
        }
    })
});

router.get('/latest', function (req, res, next) {
    Phone.findLatestPublish(function (err, result) {
        if (err) {
            res.error('Query failed', err);
        } else {
            if (result.length === 0) {
                res.error('Query result does not exist');
            } else {
                res.return('Query successfully', result[0]);
            }
        }
    })
});

router.get('/brands', function (req, res, next) {
    Phone.findAllBrands(function (err, result) {
        if (err) {
            res.error('Query failed', err);
        } else {
            res.return('Query successfully', result);
        }
    })
});

router.get('/:id', function (req, res, next) {
    Phone.findById(req.params.id, function (err, result) {
        if (result) {
            res.return('Query successfully', result);
        } else {
            res.error('Query result does not exist');
        }
    });
});

router.get('/:brand/:model', function (req, res, next) {
    Phone.findByBrandAndModel(req.params.brand, req.params.model, function (err, result) {
        if (result) {
            res.return('Query successfully', result);
        } else {
            res.error('Query result does not exist');
        }
    });
});

router.post('/', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        if (!req.body.brand) {
            res.error('Brand is empty');
        } else if (!req.body.model) {
            res.error('Model is empty');
        } else {
            var md5 = crypto.createHash('md5');
            var phone = new Phone({
                unique: md5.update(req.body.brand + req.body.model).digest('hex'),
                brand: req.body.brand,
                model: req.body.model,
                appearance: req.body.appearance,
                publish: req.body.publish,
                published: req.body.published,
                warranty_duration: req.body.warranty_duration
            });
            phone.save(function (err, phone) {
                if (phone) {
                    if (req.body._id) {
                        Instruction.findByPhoneId(req.body._id, function (err, result) {
                            if (result.length !== 0) {
                                var md5 = crypto.createHash('md5');
                                var objs = result.map((data)=> {
                                    var obj = data.toObject();
                                    obj.phone_id = phone._id;
                                    obj.unique = md5.update(obj.phone_id.toString() + obj.lang).digest('hex');
                                    delete obj._id;
                                    delete obj.created_at;
                                    delete obj.updated_at;
                                    (obj.banners || []).forEach((banner)=> {
                                        delete banner._id;
                                    });
                                    (obj.items || []).forEach((item)=> {
                                        delete item._id;
                                        (item.pages || []).forEach((page)=> {
                                            delete page._id;
                                        });
                                    });
                                    return new Instruction(obj);
                                });
                                Instruction.insert(objs, function () {
                                    res.return('Create successfully', phone);
                                });
                            } else {
                                res.return('Create successfully', phone);
                            }
                        });
                    } else {
                        res.return('Create successfully', phone);
                    }
                } else {
                    res.error('Create failed', err);
                }
            });
        }
    });
});

router.put('/:id', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        if (!req.body.brand) {
            res.error('Brand is empty');
        } else if (!req.body.model) {
            res.error('Model is empty');
        } else {
            var data = Object.assign({}, req.body);
            var md5 = crypto.createHash('md5');
            data.unique = md5.update(req.body.brand + req.body.model).digest('hex');
            Phone.updateInfo(req.params.id, data, function (err, result) {
                if (result) {
                    res.return('Update successfully', result);
                } else {
                    res.error('Update failed');
                }
            });
        }
    });
});

router.delete('/:id', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        Phone.deleteById(req.params.id, function (err, result) {
            if (result) {
                Warranty.deleteByPhoneId(req.params.id, function () {
                    Instruction.deleteByPhoneId(req.params.id, function () {
                        res.json({status: 0, message: 'Delete successfully', data: result});
                    });
                });
            } else {
                res.error('Delete failed');
            }
        });
    });
});

module.exports = router;