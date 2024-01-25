// Récupérer le modèle
const User = require("../models/User");
// Permet de chiffrer le mot de passe avant l'enrgistrement dans la base de données
const bcrypt = require("bcrypt");
// Json Web Token
const jwt = require("jsonwebtoken");

/* register to application */
const Register = async (req, res) => {
  try {
    console.log("hellooo")
    // Vérifier si un utilisateur avec le même nom d'utilisateur ou la même adresse e-mail existe déjà
    const existingUser = await User.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.email }
      ]
    });  

    if (existingUser) {
      console.log("user exist")
      return res.status(400).json({ message: 'Un utilisateur avec le même nom d\'utilisateur ou la même adresse e-mail existe déjà.' });
    }

    // Créer un nouvel utilisateur s'il n'existe pas déjà
    const newUser = new User(req.body);
    await newUser.save();

    res.status(200).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};
/* Create a session using SESSIONS */
const Login = async (req, res, next) => {
  try {

    // get email and hashed password
    let email = req.body.email;
    let password = req.body.password;

    const user = await User.findOne({ email }).lean();

    if (!user) {
      res.status(401).json({ error: "User does not exist" });
    } else {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          req.session.regenerate(function (err) {
            if (err) next(err);
            // Save user in session to
            req.session.user = user;
            // Send the cookie to the server
            res.send({_id : user._id, email: user.email});
            // Save session
            req.session.save(function (err) {
              if (err) return
              next(err);
            });
          });
        }
        // Incorrect password
        else res.status(403).json({ error: "Mot de passe incorrect" });
      });
    } 
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur inconnue" });
  }
};

// Logout
const Logout = async (req, res) => {
  if (req.session) {
    req.session.user = null;
    req.session.destroy();
    res.clearCookie('connect.sid', { path: '/' });
    console.log("clear session")
    res.status(200).json({
      success: true,
      message: 'Logged out',
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Session not found',
    });
  }
};

 
module.exports = { Register, Login, Logout };
