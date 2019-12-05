var mongoose = require('../common/db');
var ObjectId = mongoose.Schema.ObjectId;

var Warranty = new mongoose.Schema({
    phone: {type: ObjectId, required: true, ref: 'phone'},
    paper: {type: String, required: true},
    imei: {type: String, required: true, unique: true},
    sn: {type: String, required: true, unique: true},
    phone_no: {type: String, required: true},
    created_at: {type: Date, default: Date.now}
});

Warranty.index({imei: 1, created_at: -1});

Warranty.statics.findAll = function (callback) {
    this.find({}, callback);
};

Warranty.statics.findByPhoneId = function(phone_id, callback) {
    this.find({phone: phone_id}, callback);
};

Warranty.statics.findByPhoneNo = function(phone_no, callback) {
    this.find({phone_no: phone_no}).populate('phone').exec(callback);
}

Warranty.statics.findByImei = function (imei, callback) {
    this.findOne({imei: imei}).populate('phone').exec(callback);
};

Warranty.statics.findBySN = function(sn, callback) {
    this.findOne({sn: sn}).populate('phone').exec(callback);
}

Warranty.statics.deleteById = function (id, callback) {
    this.deleteOne({_id: id}, callback);
};

Warranty.statics.deleteByPhoneId = function(phone_id, callback) {
    this.deleteMany({phone: phone_id}, callback);
}

module.exports = mongoose.model('warranty', Warranty);