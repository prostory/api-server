var express = require("express");
var router = express.Router();
var Application = require("../models/application");
var jwt = require("../common/jwt");

router.get("/", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    Application.findAll(function(err, result) {
      if (err) {
        res.error("Query failed", err);
      } else {
        res.return("Query successfully", result);
      }
    });
  });
});

router.post("/", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    if (!req.body.package) {
      res.error("Package is required");
    } else if (!req.body.title) {
      res.error("Title is required");
    } else {
      var application = new Application({
        package: req.body.package,
        title: req.body.title,
        description: req.body.description,
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
});

router.put("/:id", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    Application.updateInfo(req.params.id, req.body, function(err, result) {
      if (result) {
        res.return("Update successfully", result);
      } else {
        res.error("Update failed");
      }
    });
  });
});

router.get("/:id", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    Application.findById(req.params.id, function(err, result) {
      if (result) {
        res.return("Query successfully", result);
      } else {
        res.error("Query failed", err);
      }
    });
  });
});

router.delete("/:id", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    Application.deleteById(req.params.id, function(err, result) {
      if (result) {
        res.return("Delete successfully", result);
      } else {
        res.error("Delete failed", err);
      }
    });
  });
});

router.post("/version/:id", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    if (!req.body.url) {
      res.error("Apk url is required");
    } else if (!req.body.version) {
      res.error("Version is required");
    } else if (!req.body.version_code) {
      res.error("Version code is required");
    } else {
      Application.addVersion(
        req.params.id,
        {
          url: req.body.url,
          version: req.body.version,
          version_code: req.body.version_code,
          details: req.body.details
        },
        function(err, result) {
          if (result) {
            res.return("Update successfully", result);
          } else {
            res.error("Update failed", err);
          }
        }
      );
    }
  });
});

router.delete("/version/:id", function(req, res, next) {
  jwt.verifyLogin(req, res, function() {
    if (!req.body.version) {
      res.error("Version is required");
    } else {
      Application.deleteVersion(
        req.params.id,
        {
          version: req.body.version
        },
        function(err, result) {
          if (result) {
            res.return("Update successfully", result);
          } else {
            res.error("Update failed", err);
          }
        }
      );
    }
  });
});

router.get("/available/:package/:version", function(req, res, next) {
  Application.findAvailableVersion(
    req.params.package,
    Number(req.params.version),
    function(err, result) {
      if (result && result.length > 0) {
        res.return("Query successfully", result[0]);
      } else {
        res.error("Query failed", err);
      }
    }
  );
});

module.exports = router;
