const model = require("./userModel");
const crypto = require("crypto");

const userController = {
  async registerByEmail(req, res) {
    // New user regitering by email/password
    // Check if email and password is sent
    if (!req.body.email || !req.body.password) {
      res.statusMessage = "Data missing";
      res.status(400).end();
      return;
    }

    const password = await saltPassword(req.body.password);

    // Something went wrong with password
    if (!password) {
      res.statusMessage = "Failed to register";
      res.status(500).end();
      return;
    }

    model.addUserByEmailAndPassword(req.body.email, password, (err, user) => {
      if (err) {
        res.statusMessage = "Email already in use";
        res.status(401).end();
        // res.status(401).send("Email already in use");
      } else {
        res.send(getSendableUserData(user));
      }
    });
  },
  loginByEmail(req, res) {
    // Check if email and password is sent
    if (!req.body.email || !req.body.password) {
      res.statusMessage = "Data missing";
      res.status(400).end();
      return;
    }

    model.getUserByEmail(req.body.email, async (err, user) => {
      if (err) {
        res.statusMessage = "Email is not registered";
        res.status(401).end();
      } else {
        const password = await isPasswordCorrect(
          req.body.password,
          user.salt,
          user.iterations,
          user.password
        );

        // Something went wrong with password
        if (password == null) {
          res.statusMessage = "Failed to register";
          res.status(500).end();
          return;
        }
        // User exists, check if passwords match
        if (password === true) {
          res.send(getSendableUserData(user));
        } else {
          res.statusMessage = "Incorrect password";
          res.status(401).end();
        }
      }
    });
  },
  async updateUserData(req, res) {
    // Update user's data in db
    // Check if id is sent
    if (!req.body.id) {
      res.statusMessage = "Data missing";
      res.status(400).end();
      return;
    }
    const id = req.body.id;
    delete req.body.id;
    if (req.body.password) {
      const hash = await saltPassword(req.body.password);
      // Something went wrong with password
      if (!hash) {
        res.statusMessage = "Failed to update";
        res.status(500).end();
        return;
      }

      req.body.password = hash.password;
      req.body.salt = hash.salt;
      req.body.iterations = hash.iterations;
    }
    
    model.updateUser(id, req.body, (err, user) => {
      if (err) {
        res.statusMessage = "Email already in use";
        res.status(401).end();
      } else {
        res.send(getSendableUserData(user));
      }
    });
  },
  uploadImage(req, res) {
    if (!req.file) {
      res.statusMessage = "Please select an image";
      res.status(400).end();
    }
    // Send image url
    res.send(req.protocol + "://" + req.get("host") + "/image/" + req.file.filename);
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
