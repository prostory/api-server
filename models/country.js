var mongoose = require("../common/db");

var Country = new mongoose.Schema({
  alpha3: { type: String, required: true, unique: true },
  activation_count: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

Country.index({ alpha3: 1, type: -1 });

Country.statics.findAll = function(callback) {
  this.find({}, callback);
};

Country.statics.fromArray = function(array, callback) {
  this.create(array, callback);
};

Country.statics.increase = function(alpha3, callback) {
  this.findOne({ alpha3: alpha3 }, function(err, res) {
    if (res) {
      this.updateOne(
        { alpha3: alpha3 },
        {
          activation_count: res.activation_count + 1,
          updated_at: Date.now()
        },
        callback
      );
    } else {
      Country.create([{ alpha3: alpha3 }], callback);
    }
  });
};

module.exports = mongoose.model("country", Country);
