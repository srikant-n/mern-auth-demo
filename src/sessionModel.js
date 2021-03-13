const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  expiry: { type: Date, default: () => Date.now() + 7*24*60*60*1000 },
});

/**
 * Model for Session
 */
const Session = (module.exports = mongoose.model("session", sessionSchema));

/**
 * Get user data from session
 * @param {String} sessionId Session ID from client
 * @param {(error, data)} callback Callback from DB
 */
module.exports.getUserBySession = (sessionId, callback) => {
  Session.findOne({ _id: sessionId, expiry:{$gt: Date.now()} }, null, { populate: "user" }, callback);
};

/**
 * Add a new session
 * @param {String} userId User ID for the session
 * @param {(error, data)} callback From DB
 */
module.exports.addSession = (userId, callback) => {
  const newSession = new Session({
    user: userId,
  });

  newSession.save(callback);
};
