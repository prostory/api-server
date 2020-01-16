var express = require('express');
var router = express.Router();
var Application = require('../models/application');

router.get('/', function (req, res, next) {
  Application.findAll(function (err, result) {
    if (err) {
      res.error('Query failed', err);
    } else {
      res.return('Query successfully', result);
    }
  })
});

router.post('/', function (req, res, next) {
  if (!req.body.brand) {
    res.error('Phone brand is required');
  } else if (!req.body.model) {
    res.error('Phone model is required');
  } else if (!req.body.paper) {
    res.error('The warranty of paper is required');
  } else if (!req.body.imei) {
    res.error('IMEI is required');
  } else if (!req.body.sn) {
    res.error('SN is required');
  } else if (!req.body.phone_no) {
    res.error('Phone number is required');
  } else {
    Phone.findByBrandAndModel(req.body.brand, req.body.model, function (err, phone) {
      if (phone) {
        var warranty = new Warranty({
          phone: phone._id,
          paper: req.body.paper,
          imei: req.body.imei,
          sn: req.body.sn,
          phone_no: req.body.phone_no,
          brand: req.body.brand,
          model: req.body.model,
          ip: getClientIP(req)
        });
        warranty.save(function (err, warranty) {
          if (err) {
            res.error('Create failed', err);
          } else {
            var result = warranty.toObject();
            result.phone = phone.toObject();
            res.return('Create successfully', result);
          }
        });
      } else {
        res.error('Phone is not exist');
      }
    });
  }
})