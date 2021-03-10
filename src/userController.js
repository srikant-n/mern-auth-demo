const model = require("./userModel");
const crypto = require("crypto");

const userController = {
  async registerByEmail(req, res) {
    // New user regitering by email/password
    // Check if email and password is sent
    if (!req.body.email || !req.body.password) {
      res.status(400).send("Data missing");
      return;
    }

    const password = await saltPassword(req.body.password);

    // Something went wrong with password
    if (!password) {
      res.status(500).send("Failed to register");
      return;
    }

    model.addUserByEmailAndPassword(req.body.email, password, (err, user) => {
      if (err) {
        res.status(401).send("Email already in use");
      } else {
        res.send(getSendableUserData(user));
      }
    });
  },
  loginByEmail(req, res) {
    // Check if email and password is sent
    if (!req.body.email || !req.body.password) {
      res.status(400).send("Data missing");
      return;
    }

    model.getUserByEmail(req.body.email, async (err, user) => {
      if (err) {
        res.status(401).send("Email is not registered");
      } else {
        const password = await isPasswordCorrect(
          req.body.password,
          user.salt,
          user.iterations,
          user.password
        );
        
        // Something went wrong with password
        if (password == null) {
          res.status(500).send("Failed to register");
          return;
        }
        // User exists, check if passwords match
        if (password === true) {
          res.send(getSendableUserData(user));
        } else {
          res.status(401).send("Incorrect password");
        }
      }
    });
  },
  updateUserData(req, res) {
    // Update user's data in db
    // Check if id is sent
    if (!req.body.id) {
      res.status(400).send("Data missing");
      return;
    }
    const id = req.body.id;
    delete req.body.id;
    model.updateUser(id, req.body, (err, user) => {
      if (err) {
        res.status(401).send("Email already in use");
      } else {
        res.send(getSendableUserData(user));
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
    website: user.website,
    email: user.email ? user.email : user.socialMail,
  };
}

/**
 * Hash a password with salt
 * @param {String} password Entered password
 * @param {String} salt Salt for the password
 * @param {Number} iterations Number of sat rounds
 * @returns {Promise} Hashed password
 */
function hashPassword(password, salt, iterations) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, 64, "sha512", (error, key) => {
      if (error) {
        reject(error);
      } else {
        resolve(key.toString("hex"));
      }
    });
  });
}

/**
 * Salt a password
 * @param {String} password Entered password
 * @returns {Promise} Salted password
 */
function saltPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const iterations = Math.floor(Math.random() * 10) + 1;
    hashPassword(password, salt, iterations)
      .then((hash) => resolve({ password: hash, salt: salt, iterations: iterations }))
      .catch((error) => reject(error));
  });
}

/**
 * Is the entered password correct?
 * @param {String} password Entered password
 * @param {String} salt Salt for the password
 * @param {String} iterations Number of salting rounds
 * @param {String} hash Hash to compare with
 * @returns {Promise(Boolean)}
 */
function isPasswordCorrect(password, salt, iterations, hash) {
  return new Promise((resolve, reject) => {
    hashPassword(password, salt, iterations)
      .then((newHash) => resolve(hash === newHash))
      .catch((error) => reject(null));
  });
}

module.exports = userController;
