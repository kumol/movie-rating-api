var mongoose = require('mongoose');

var actorSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name:  {type: String , required: true},
    birthday: {type: String , required: true},
    country: {type:String }
});

module.exports = mongoose.model('Actor',actorSchema); 