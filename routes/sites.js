var express = require('express');
var router = express.Router();
var jwt = require('../common/jwt');
var Site = require('../models/site');

router.get('/', function (req, res, next) {
    Site.findAll(function (err, result) {
        if (err) {
            res.error('Query failed', err);
        } else {
            res.return('Query successfully', result);
        }
    })
});

router.post('/', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        if (!req.body.name) {
            res.error('Name is empty');
        } else if (!req.body.address) {
            res.error('Address is empty');
        } else if (!req.body.long || !req.body.lat) {
            res.error('Longitude or latitude is empty');
        } else {
            var site = new Site({
                name: req.body.name,
                address: req.body.address,
                long: req.body.long,
                lat: req.body.lat
            });
            site.save(function (err, result) {
                if (result) {
                    res.return('Create successfully', result);
                } else {
                    res.error('Create failed');
                }
            });
        }
    });
});

router.put('/:id', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        if (!req.body.name) {
            res.error('Name is empty');
        } else if (!req.body.address) {
            res.error('Address is empty');
        } else if (!req.body.long || !req.body.lat) {
            res.error('Longitude or latitude is empty');
        } else {
            Site.updateInfo(req.params.id, {
                name: req.body.name,
                address: req.body.address,
                long: req.body.long,
                lat: req.body.lat
            }, function (err, result) {
                if (result) {
                    res.return('Update Successfully', result);
                } else {
                    res.error('Update failed');
                }
            });
        }
    });
});

router.delete('/:id', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        Site.deleteById(req.params.id, function (err, result) {
            if (result) {
                res.return('Delete successfully', result);
            } else {
                res.error('Delete failed');
            }
        });
    });
});

module.exports = router;