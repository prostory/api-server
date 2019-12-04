module.exports = function (req, res, next) {
    res.verifyError = function(message) {
        res.json({status: 2, message: message});
    }
    res.error = function (message, reason) {
        res.json({status: 1, message: message, reason: reason});
    };
    res.return = function (message, data) {
        res.json({status: 0, message: message, data: data});
    };
    next();
}