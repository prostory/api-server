var mongoose = require('../common/db');

var Application = new mongoose.Schema({
  package: {type: String, required: true, unique: true},
  title: {type: String, required: true},
  history: [
    {
      url: {type: String, required: true},
      version: {type: String, required: true},
      version_code: {type: Number, required: true, default: 0},
      created_at: {type: Date, default: Date.now}
    }
  ],
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

Application.index({package: 1, 'history.created_at': -1});

Application.statics.findAll = function (callback) {
  this.find({}, callback);
};

Application.statics.findByTitle = function (title, callback) {
  this.find({title: title}, callback);
};

Application.statics.findByPackage = function (pkg, callback) {
  this.findOne({package: pkg}, callback);
};

Application.statics.findUpdateVersion = function (pkg, version_code, callback) {
  this.findOne({package: pkg, 'history.version_code': {$gt: version_code}}, callback)
}

Application.statics.addVersion = function(pkg, url, version, version_code, callback) {
  this.updateOne({package: pkg}, {updated_at: Date.now(), $push: {url: url, version: version,
      version_code: version_code}}, callback);
}

Application.statics.deleteById = function (id, callback) {
  this.deleteOne({_id: id}, callback);
};

Application.statics.deleteByPackage = function (pkg, callback) {
  this.deleteOne({package: pkg}, callback);
};

module.exports = mongoose.model('application', Application);