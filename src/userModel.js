const mongoose = require("mongoose");

/**
 * This callback is displayed as a global member.
 * @callback requestCallback
 * @param {Object} error null if no error
 * @param {Object} data requested data
 */

/**
 * Schema for User collection
 */
const userSchema = new mongoose.Schema({
  name: String,
  photo: String,
  bio: String,
  website: String,
  email: { type:String, unique : true, required : true},
  password: String,
  salt: String,
  iterations: Number,
  socialMail: { type:String, unique : true, sparse:true },
  googleId: { type:String, unique : true, sparse:true },
  facebookId: { type:String, unique : true, sparse:true },
  twitterId: { type:String, unique : true, sparse:true },
  date: {type: Date, default: Date.now}
});

/**
 * Model for users
 */
const User = module.exports = mongoose.model('user', userSchema);

/**
 * Get user data if email and password match
 * @param {String} email User's email address
 * @param {requestCallback} callback Callback for the user find
 */
module.exports.getUserByEmail = (email, callback) => {
    User.findOne({ "email": email.toLowerCase() }, callback);
}

/**
 * Add a new user to the database
 * @param {String} email User's email address
 * @param {Object} hash Salted password
 * @param {requestCallback} callback Callback for the user find
 */
module.exports.addUserByEmailAndPassword = (email, hash, callback) => {
    const user = new User({
        "email": email.toLowerCase(),
        password: hash.password,
        salt: hash.salt,
        iterations: hash.iterations
    });

    user.save(callback);
}

/**
 * Update user data
 * @param {String} id User's _id in db
 * @param {Object} userData User's data to update
 * @param {requestCallback} callback Callback with userdata after update
 */
module.exports.updateUser = (id, userData, callback) => {
    User.findByIdAndUpdate(id, userData,{new:true}, callback);
}