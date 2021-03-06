const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true}
});

//Export function to create "User" model class
module.exports = mongoose.model("User", UserSchema);