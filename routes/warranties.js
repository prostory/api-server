var express = require("express");
var router = express.Router();
var jwt = require("../common/jwt");
var Warranty = require("../models/warranty");
var Country = require("../models/country");
var Phone = require("../models/phone");
var Location = require("../models/location");
var geoIP = require("offline-geo-from-ip");
var countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

router.get("/imei/:imei", function(req, res, next) {
  Warranty.findByImei(req.params.imei, function(err, result) {
    if (result) {
      res.return("Query successfully", result);
    } else {
      res.return("Query result does not exist");
    }
  });
});

router.get("/sn/:sn", function(req, res, next) {
  Warranty.findBySN(req.params.sn, function(err, result) {
    if (result) {
      res.return("Query successfully", result);
    } else {
      res.return("Query result does not exist");
    }
  });
});

router.get("/phoneNo/:phone_no", function(req, res, next) {
  Warranty.findByPhoneNo(req.params.phone_no, function(err, result) {
    if (result) {
      res.return("Query successfully", result);
    } else {
      res.return("Query result does not exist");
    }
  });
});

router.get("/phones/:brand/:model", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    Phone.findByBrandAndModel(req.params.brand, req.params.model, function(
      err,
      phone
    ) {
      if (phone) {
        Warranty.findByPhoneId(phone.id, function(err, warranties) {
          if (warranties) {
            res.return("Query successfully", warranties);
          } else {
            res.error("Query failed", err);
          }
        });
      } else {
        res.error("Phone is not exist");
      }
    });
  });
});

router.post("/", function(req, res, next) {
  if (!req.body.brand) {
    res.error("Phone brand is required");
  } else if (!req.body.model) {
    res.error("Phone model is required");
  } else if (!req.body.paper) {
    res.error("The warranty of paper is required");
  } else if (!req.body.imei) {
    res.error("IMEI is required");
  } else if (!req.body.sn) {
    res.error("SN is required");
  } else if (!req.body.phone_no) {
    res.error("Phone number is required");
  } else {
    Phone.findByBrandAndModel(req.body.brand, req.body.model, function(
      err,
      phone
    ) {
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
        warranty.save(function(err, warranty) {
          if (err) {
            res.error("Create failed", err);
          } else {
            var data = geoIP.allData(warranty.ip);
            if (data && data.country) {
              var alpha3 = countries.getAlpha3Code(data.country, "en");
              Country.increase(alpha3, function() {
                var location = new Location(data);
                Location.save(location, function() {
                  res.return("Create successfully", warranty);
                });
              });
            } else {
              res.return("Create successfully", warranty);
            }
          }
        });
      } else {
        res.error("Phone is not exist");
      }
    });
  }
});

router.post("/fetch", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    var filter = req.body.filter || {};
    Object.keys(filter).forEach(key => {
      if (typeof filter[key] === "string" && filter[key].indexOf("/") === 0) {
        filter[key] = eval(filter[key]);
      }
    });
    Warranty.countDocuments(filter, function(err, count) {
      if (err) {
        res.error("Query failed", err);
      } else {
        var skip = req.body.skip || 0;
        var limit = req.body.limit || 10;
        var sort = req.body.sort || { created_at: -1 };
        Warranty.fetch(filter, skip, limit, sort, function(err, result) {
          if (err) {
            res.error("Query failed", err);
          } else {
            res.return("Query successfully", {
              result: result,
              count: count
            });
          }
        });
      }
    });
  });
});

router.post("/repair/:name", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    if (req.params.name === "location") {
      Location.deleteMany({}, function(err) {
        if (!err) {
          Warranty.findAll(function(err, result) {
            if (result.length > 0) {
              var data = [];
              result.forEach(function(warranty) {
                var location = geoIP.allData(warranty.ip);
                if (location && location.country) {
                  location.ip = warranty.ip;
                  data.push(location);
                }
              });
              Location.fromArray(data, function(err, result) {
                if (!err) {
                  res.return("Repaired successfully", result);
                } else {
                  res.error("Repaired failed", err);
                }
              });
            }
          });
        } else {
          res.error("Repaired failed", err);
        }
      });
    } else if (req.params.name === "country") {
      Country.deleteMany({}, function(err) {
        if (!err) {
          Warranty.findAll(function(err, result) {
            if (result.length > 0) {
              var data = {};
              result.forEach(function(warranty) {
                var location = geoIP.allData(warranty.ip);
                if (location && location.country) {
                  var alpha3 = countries.getAlpha3Code(location.country, "en");
                  var country = data[alpha3];
                  if (country) {
                    country.activation_count++;
                  } else {
                    data[alpha3] = {
                      alpha3: alpha3,
                      activation_count: 1
                    };
                  }
                }
              });
              var array = [];
              for (var key in data) {
                array.push(data[key]);
              }
              Country.fromArray(array, function(err, result) {
                if (!err) {
                  res.return("Repaired successfully", result);
                } else {
                  res.error("Repaired failed", err);
                }
              });
            }
          });
        } else {
          res.error("Repaired failed", err);
        }
      });
    }
  });
});

router.post("/statistics", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    Country.findAll(function(err, result) {
      if (err) {
        res.error("Query failed", err);
      } else {
        res.return("Query successfully", result);
      }
    });
  });
});

router.delete("/:id", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    Warranty.deleteById(req.params.id, function(err, result) {
      if (result) {
        res.return("Delete successfully", result);
      } else {
        res.error("Delete failed");
      }
    });
  });
});

function getClientIP(req) {
  let ip = req.headers["x-forwarded-for"];
  if (ip && ip.toLowerCase() !== "unknown") {
    let index = ip.indexOf(",");
    if (index >= 0) {
      return ip.substring(0, index);
    } else {
      return ip;
    }
  }

  ip =
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  return ip === "::1" ? "127.0.0.1" : ip;
}

module.exports = router;
