var express = require('express');
var router = express.Router();
var jwt = require('../common/jwt');
var formidable = require('formidable');
var moment = require('moment');
var fs = require('fs');
var pathParser = require('path');
var sharp = require('sharp');
var sizeOf = require('image-size');
var global = require('../common/global')

router.post('/upload/', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'public/upload/images/' + date() + '/';
    form.keepExtensions = true;

    if (!fs.existsSync(form.uploadDir)) {
        fs.mkdirSync(form.uploadDir, {recursive: true});
    }

    var files = [];

    form.on('file', function (field, file) {
        var dimensions = sizeOf(file.path)
        files.push({
            url: global.domain + file.path,
            width: dimensions.width,
            height: dimensions.height,
            filed: field,
            file: file
        });
    });

    form.parse(req, function (err, fields) {
        if (err) {
            res.error('Upload failed', err);
        } else {
            res.return('Upload successfully', files);
        }
    });
});

router.get('/public/upload/images/*', function (req, res, next) {
    var query = req.query;
    var source = req.path.substr(1);
    var path = pathParser.parse(source);
    if (req.path !== req.url) {
        var dest = path.dir + pathParser.sep + path.name;
        var size = getResize(source, query.x, query.y);
        query.quality = query.quality || 80;
        dest = dest + '_' + size[0] + 'x' + size[1] + '_' + query.quality + '.' + (query.ext || path.ext);
        fs.exists(dest, (exists) => {
            if (exists) {
                redirectImage(res, dest);
            } else {
                if (source !== dest) {
                    sharp(source)
                        .resize(parseInt(size[0]), parseInt(size[1]))
                        .toFormat(query.ext || path.ext.substring(1), {quality: Number(query.quality)})
                        .toFile(dest, function (err, info) {
                            redirectImage(res, err ? source : dest)
                        });
                } else {
                    redirectImage(res, source);
                }
            }
        })
    } else {
        redirectImage(res, source);
    }
});

router.delete('/public/upload/images/*', function (req, res, next) {
    jwt.verifyLogin(req, res, function () {
        var path = req.url
        fs.exists(path, function (exists) {
            if (exists) {
                fs.unlink(path, function (err) {
                    if (err) {
                        res.error('Delete failed', err);
                    } else {
                        res.return('Delete successfully');
                    }
                });
            } else {
                res.error('File is not exist');
            }
        });
    });
});

function getResize(file, w, h) {
    var result = [];
    var dimensions, x, y;
    if (w) {
        if (h) {
            dimensions = sizeOf(file);
            var scaleX = w / dimensions.width;
            var scaleY = h / dimensions.height;
            if (scaleX > 1 || scaleY > 1) {
                var scale = Math.max(scaleX, scaleY);
                result.push(w/scale, h/scale);
            } else {
                result.push(w, h);
            }
        } else {
            dimensions = sizeOf(file);
            if (w < dimensions.width) {
                x = w;
                y = x / dimensions.width * dimensions.height;
                result.push(x, y);
            } else {
                result.push(dimensions.width, dimensions.height);
            }
        }
    } else if (h) {
        dimensions = sizeOf(file);
        if (h < dimensions.height) {
            y = h;
            x = y / dimensions.height * dimensions.width;
            result.push(x, y);
        } else {
            result.push(dimensions.width, dimensions.height);
        }
    } else {
        dimensions = sizeOf(file);
        result.push(dimensions.width, dimensions.height);
    }

    return result;
}

function redirectImage(res, file) {
    res.redirect(file.replace(/^public/, '/api'));
}

function date() {
    return moment(Date.now()).format('YYYY/MM/DD');
}

module.exports = router;