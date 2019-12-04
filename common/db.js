var mongoose = require('mongoose');
var url = 'mongodb://localhost/after-safe';

mongoose.set('useCreateIndex', true)
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = mongoose;