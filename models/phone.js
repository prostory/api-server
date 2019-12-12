var mongoose = require('../common/db');

var Phone = new mongoose.Schema({
    unique: {type: String, required: true, unique: true},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    appearance: {type: String, default: ''},
    publish: {type: Date, default: Date.now},
    published: {type: Boolean, default: false},
    warranty_duration: {type: Number, default: 12},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

Phone.statics.findAll = function (callback) {
    this.find({}, callback);
};

Phone.statics.findLatestPublish = function (callback) {
    this.find().sort({ publish: -1 }).limit(1).exec(callback);
}

Phone.statics.findAllBrands = function (callback) {
    this.distinct('brand').exec(callback);
}

Phone.statics.findByBrandAndModel = function (brand, model, callback) {
    this.findOne({brand: brand, model: model}, callback);
};

Phone.statics.updateInfo = function (id, data, callback) {
    delete data._id
    data.updated_at = Date.now()
    this.updateOne({_id: id}, data, callback);
};

Phone.statics.deleteById = function (id, callback) {
    this.deleteOne({_id: id}, callback);
};

module.exports = mongoose.model('phone', Phone);