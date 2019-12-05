var mongoose = require('../common/db');

var Site = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    long: {type: Number, required: true},
    lat: {type: Number, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

Site.statics.findAll = function (callback) {
    this.find({}, callback);
};

Site.statics.updateInfo = function (id, data, callback) {
    delete data._id
    data.updated_at = Date.now()
    this.updateOne({_id: id}, data, callback);
};

Site.statics.deleteById = function (id, callback) {
    this.deleteOne({_id: id}, callback);
};

module.exports = mongoose.model('site', Site);