var express = require("express");
var router = express.Router();
var jwt = require("../common/jwt");
var Site = require("../models/site");

router.get("/:brand", function(req, res, next) {
  Site.findByBrand(req.params.brand, function(err, result) {
    if (err) {
      res.error("Query failed", err);
    } else {
      res.return("Query successfully", result);
    }
  });
});

router.post("/fetch", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    var filter = req.body.filter || {};
    Object.keys(filter).forEach(key => {
      if (typeof filter[key] === "string" && filter[key].indexOf("/") === 0) {
        filter[key] = eval(filter[key]);
      }
    });
    Site.countDocuments(filter, function(err, count) {
      if (err) {
        res.error("Query failed", err);
      } else {
        var skip = req.body.skip || 0;
        var limit = req.body.limit || 10;
        var sort = req.body.sort || { created_at: -1 };
        Site.fetch(filter, skip, limit, sort, function(err, result) {
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

router.post("/", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    if (!req.body.brand) {
      res.error("Brand is empty");
    } else if (!req.body.name) {
      res.error("Name is empty");
    } else if (!req.body.address) {
      res.error("Address is empty");
    } else if (!req.body.long || !req.body.lat) {
      res.error("Longitude or latitude is empty");
    } else {
      var site = new Site({
        brand: req.body.brand,
        name: req.body.name,
        address: req.body.address,
        locales: req.body.locales,
        long: req.body.long,
        lat: req.body.lat
      });
      site.save(function(err, result) {
        if (result) {
          res.return("Create successfully", result);
        } else {
          res.error("Create failed");
        }
      });
    }
  });
});

router.put("/:id", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    if (!req.body.brand) {
      res.error("Brand is empty");
    } else if (!req.body.name) {
      res.error("Name is empty");
    } else if (!req.body.address) {
      res.error("Address is empty");
    } else if (!req.body.long || !req.body.lat) {
      res.error("Longitude or latitude is empty");
    } else {
      Site.updateInfo(
        req.params.id,
        {
          brand: req.body.brand,
          name: req.body.name,
          address: req.body.address,
          locales: req.body.locales,
          long: req.body.long,
          lat: req.body.lat
        },
        function(err, result) {
          if (result) {
            res.return("Update Successfully", result);
          } else {
            res.error("Update failed");
          }
        }
      );
    }
  });
});

router.delete("/:id", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    Site.deleteById(req.params.id, function(err, result) {
      if (result) {
        res.return("Delete successfully", result);
      } else {
        res.error("Delete failed");
      }
    });
  });
});

module.exports = router;
