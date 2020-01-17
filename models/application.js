var mongoose = require("../common/db");

var Application = new mongoose.Schema({
  package: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  history: [
    {
      url: { type: String, required: true },
      version: { type: String, required: true },
      version_code: { type: Number, required: true, default: 0 },
      details: { type: String, default: "" },
      created_at: { type: Date, default: Date.now }
    }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

Application.index({ package: 1, "history.created_at": -1 });

Application.statics.findAll = function(callback) {
  this.find({}).exec(callback);
};

Application.statics.updateInfo = function(id, data, callback) {
  delete data._id;
  data.updated_at = Date.now();
  this.updateOne({ _id: id }, data, callback);
};

Application.statics.findAvailableVersion = function(
  pkg,
  version_code,
  callback
) {
  this.aggregate()
    .unwind("history")
    .match({ package: pkg })
    .match({ "history.version_code": { $gt: version_code } })
    .sort({ "history.version_code": -1 })
    .limit(1)
    .project({
      _id: 0,
      package: 1,
      title: 1,
      description: 1,
      version: "$history.version",
      versionCode: "$history.version_code",
      url: "$history.url",
      details: "$history.details",
      created_at: "$history.created_at"
    })
    .exec(callback);
};

Application.statics.addVersion = function(id, data, callback) {
  this.update(
    { _id: id },
    {
      updated_at: Date.now(),
      $push: { history: { $each: [data], $sort: { created_at: -1 } } }
    },
    callback
  );
};

Application.statics.deleteVersion = function(id, data, callback) {
  this.update(
    { _id: id },
    {
      updated_at: Date.now(),
      $pull: { history: data }
    },
    callback
  );
};

Application.statics.deleteById = function(id, callback) {
  this.deleteOne({ _id: id }, callback);
};

module.exports = mongoose.model("application", Application);
