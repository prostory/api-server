var express = require("express");
var router = express.Router();
var Application = require("../models/application");

router.get("/", function(req, res, next) {
  Application.findAll(function(err, result) {
    if (err) {
      res.error("Query failed", err);
    } else {
      res.return("Query successfully", result);
    }
  });
});

router.post("/", function(req, res, next) {
  if (!req.body.package) {
    res.error("Package is required");
  } else if (!req.body.title) {
    res.error("Title is required");
  } else {
    var application = new Application({
      package: req.body.package,
      title: req.body.title,
      history: []
    });
    application.save(function(err, result) {
      if (result) {
        res.return("Create successfully", result);
      } else {
        res.error("Create failed", err);
      }
    });
  }
});

module.exports = router;
