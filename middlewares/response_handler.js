module.exports = function (req, res, next) {
    res.verifyError = function(message) {
        res.json({status: 1, message: message});
    }
    res.error = function (message, reason) {
        if (reason && reason.code === 11000) {
            res.json({status: 2, message: message, reason: 'Duplicate creation'});
        } else {
            res.json({status: 2, message: message, reason: reason});
        }
    };
    res.return = function (message, data) {
        if (data.n === 0 && data.ok === 1) {
            if (data.deletedCount === 0) {
                res.json({status: 3, message: 'Delete nothing', data: data});
            } else if (data.nModified === 0) {
                res.json({status: 3, message: 'Modify nothing', data: data});
            }
        } else {
            res.json({status: 0, message: message, data: data});
        }
    };
    next();
}