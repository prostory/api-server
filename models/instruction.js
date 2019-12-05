var mongoose = require('../common/db');
var ObjectId = mongoose.Schema.ObjectId;

var Instruction = new mongoose.Schema({
    unique: {type: String, required: true, unique: true},
    phone_id: {type: ObjectId, required: true, ref: 'phone'},
    lang: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    banners: [
        {
            url: {type: String, required: true},
            image: {
                url: {type: String, required: true},
                width: {type: Number, default: 0},
                height: {type: Number, default: 0}
            }
        }
    ],
    items: [
        {
            image: {type: String, required: true},
            title: {type: String, required: true},
            description: {type: String, required: true},
            pages: [
                {
                    icon: {type: String, required: true},
                    title: {type: String, required: true},
                    jump: {
                        name: {type: String, default: ''},
                        url: {type: String, default: ''},
                    },
                    media: {
                        url: {type: String, required: true},
                        desc: {
                            width: {type: Number, default: 0},
                            height: {type: Number, default: 0},
                            size: {type: Number, default: 0},
                            isVideo: {type: Boolean, default: false},
                        }
                    },
                    description: {type: String, required: true},
                }
            ]
        }
    ],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

Instruction.statics.findAll = function (callback) {
    this.find({}, callback);
};

Instruction.statics.findByPhoneId = function (phoneId, callback) {
    this.find({phone_id: phoneId}, callback);
};

Instruction.statics.insert = function(instructions, callback) {
    this.insertMany(instructions, callback);
}

Instruction.statics.findItemById = function(id, callback) {
    this.findOne({'items._id': id}, callback)
}

Instruction.statics.findByPhoneIdAndLang = function (phoneId, lang, callback) {
    this.find({phone_id: phoneId, lang: lang}, callback);
};

Instruction.statics.updateInfo = function (id, data, callback) {
    delete data._id
    data.updated_at = Date.now()
    this.updateOne({_id: id}, data, callback);
};

Instruction.statics.deleteById = function (id, callback) {
    this.deleteOne({_id: id}, callback);
};

Instruction.statics.deleteByPhoneId = function (phoneId, callback) {
    this.deleteMany({phone_id: phoneId}, callback);
};

module.exports = mongoose.model('instruction', Instruction);