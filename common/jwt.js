var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');

var private_cert = fs.readFileSync(path.join(__dirname, '../pem/private_key.pem'));
var public_cert = fs.readFileSync(path.join(__dirname, '../pem/public_key.pem'));

function generateToken(data, duration = 3600) {
    var created = Math.floor(Date.now() / 1000);
    return jwt.sign({
        data: data,
        overdue: created + duration
    }, private_cert, {algorithm: 'RS256'});
}
function verifyToken(token, callback) {
    try {
        var result = jwt.verify(token, public_cert, {algorithm: ['RS256']}) || {};
        var overdue = result.overdue || 0;
        var current = Math.floor(Date.now() / 1000);
        if (current <= overdue) {
            if (callback) {
                return callback(result.data || {})
            }
            return result.data || {}
        }
    } catch (e) {
    }
}
function verifyLogin(req, res, next) {
    if (!req.headers.token) {
        res.verifyError('请先登录');
    } else if (!verifyToken(req.headers.token)) {
        res.verifyError('登录已过期，请重新登录');
    } else {
        next();
    }
}

module.exports = {
    generateToken,
    verifyToken,
    verifyLogin
}