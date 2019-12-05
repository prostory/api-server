var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var marked = require('marked');

router.get('/', function(req, res, next) {
  var index = path.resolve(__dirname, '../public/readme.html');
  var readme = path.resolve(__dirname, '../README.md');
  if (fs.existsSync(readme)) {
    if (fs.existsSync(index)) {
      if (fs.statSync(index).mtimeMs < fs.statSync(readme).mtimeMs) {
        generateIndex(readme, index, function () {
          res.redirect('/api/readme.html');
        });
      } else {
        res.redirect('/api/readme.html');
      }
    } else {
      generateIndex(readme, index, function (status) {
        if (status) {
          res.redirect('/api/readme.html');
        } else {
          res.render('index', { title: 'Express'});
        }
      });
    }
  } else if (fs.existsSync(index)) {
    res.redirect('/api/readme.html');
  } else {
    res.render('index', { title: 'Express' });
  }
});

function generateIndex(readme, index, callback) {
  fs.readFile(readme, 'utf-8', function (err, data) {
    if (err) {
      callback(false);
    } else {
      fs.writeFile(index, toHtml(data), function (err) {
        if (err) {
          callback(false);
        } else {
          callback(true);
        }
      })
    }
  });
}

function toHtml(data) {
  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code) {
      return require('highlight.js').highlightAuto(code).value;
    },
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  });
  return "<!DOCTYPE html>\n" +
      "<html>\n" +
      "  <head>\n" +
      "    <meta charset=\"utf-8\">\n" +
      "    <meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\">\n" +
      "    <title>Server api</title>\n" +
      "    <link rel=\"stylesheet\" href=\"stylesheets/github.css\">\n" +
      "  </head>\n" +
      "  <body>\n" +
        marked(data) +
      "  </body>\n" +
      "</html>"
}

module.exports = router;
