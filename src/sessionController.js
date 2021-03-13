const model = require("./sessionModel");

const sessionController = {
  addSession(req, res) {
    // Create new session
    // Check if id and session id are sent
    if (!req.body.id) {
      res.statusMessage = "Data missing";
      res.status(400).end();
      return;
    }

    model.addSession(req.body.id, (err, session) => {
      if (err) {
        res.statusMessage = "Error saving session";
        res.status(500).end();
      } else {
        res.send(session._id);
      }
    });
  },
  getUserSession(req, res) {
    //Get user from session
    // Check if session is sent
    if (!req.body.session) {
      res.statusMessage = "Data missing";
      res.status(400).end();
      return;
    }

    model.getUserBySession(req.body.session, async (err, session) => {
      if (err) {
        res.statusMessage = "Session not found";
        res.status(401).end();
      } else {
        res.send(getSendableUserData(session.user));
      }
    });
  },
};

function getSendableUserData(user) {
  return {
    id: user._id,
    name: user.name,
    photo: user.photo,
    bio: user.bio,
    phone: user.phone,
    email: user.email ? user.email : user.socialMail,
  };
}

module.exports = sessionController;
