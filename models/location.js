var mongoose = require("../common/db");

var Location = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  code: {
    state: String,
    country: String,
    continent: String
  },
  city: String,
  state: String,
  country: String,
  continent: String,
  postal: String,
  location: {
    accuracy_radius: Number,
    latitude: Number,
    longitude: Number,
    metro_code: Number,
    time_zone: String
  },
  created_at: { type: Date, default: Date.now }
});

Location.index({ ip: 1, type: -1 });

Location.statics.add = function(location, callback) {
  Location.findOne({ ip: location.ip }, function(err, result) {
    if (!result) {
      Location.create(location, callback);
    }
  });
};

Location.statics.fromArray = function(array, callback) {
  this.create(array, callback);
};

module.exports = mongoose.model("location", Location);
