var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    userName:{type:String,unique : true,required:true},
    password:{type:String,required:true}
});
module.exports = mongoose.model("User",userSchema);