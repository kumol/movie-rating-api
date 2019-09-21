var mongoose = require('mongoose');
var movieSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    actor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" , required:true}],
    rating: { type: Number, default: 1},
    year:{type:String },
    title:String
});
module.exports = mongoose.model("Movie",movieSchema); 