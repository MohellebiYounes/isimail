// Démarrer express
const express = require("express");
var bodyParser = require("body-parser");
const multer = require('multer');
const path = require('path');


const mongoose = require("mongoose");
// Used for session saving

// Accepter les variables d'environnement
const env = require("dotenv").config();

// Importer les routes
const UserRouter = require("./routes/User");
const EmailRouter = require("./routes/Email");

const AuthRouter = require("./routes/Auth");
const MessageRouter = require("./routes/Message");
const UploadRouter = require("./routes/Upload");
const CallRouter = require("./routes/Call");
const RouterTrash = require("./routes/Trash");
const DraftsRouter = require("./routes/Drafts");

const { compareSync } = require("bcrypt");
var session = require('express-session');
const cors = require('cors')

// Créer une application express 
app = express(); 

// Configure the session store and options
const MongoStore = require('connect-mongo');
const ContactMessengerRouter = require("./routes/MessengerContact");

const store = MongoStore.create({ mongoUrl: process.env.DB_URI });

const sessionConfig = {
  secret: process.env.AUTH_TOKEN,
  resave: false,
  saveUninitialized: true,
  store,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 30,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true
  } 
};

// Configure the cors options
const corsOptions = {
  origin: 'http://localhost:3000', // The frontend origin
  optionsSuccessStatus: 200,
  credentials: true // Allow cookies
}; 

// Use the express-session and cors middlewares
app.use(session(sessionConfig));
app.use(cors(corsOptions));


var jsonParser = bodyParser.json();
app.use(express.json());




/* JAWT code, json web token are not meant for sessions
simple cookie sessions are better */ 
/*
function auth(req, res, next) { 
  const authHeader = req.headers["authorization"];
  const authToken = authHeader && authHeader.split(" ")[1];
  if (authToken == null) return res.sendStatus(401);
  jwt.verify(authToken, process.env.AUTH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403); 
    req.user = user;
    next();  
  });
}
*/

/* Is user logged in */
const isAuthenticated = async (req, res, next) => {
  const { user } = req.session
  if(!user)
    res.status(401).json({ message: "Unauthorized"})
  else
   next() 
}
 
const db = (module.exports = () => {
  try {
    // Connexion à MongoDB en utilisant Mongoose et la variable d'environnemennt DB_URI
    // Voir le fichier .env dans la racine du dossier "server"
    const uri = process.env.DB_URI;

    mongoose.connect(uri);
    console.log("Connexion établie avec success");
    // Route vers la gestion des utilisateurs
    app.use("/users", isAuthenticated, jsonParser, UserRouter);
    // Route pour la gestion des Emails
    app.use("/emails", jsonParser, EmailRouter);
    app.use('/trash',jsonParser, RouterTrash);
    app.use('/drafts',jsonParser, DraftsRouter);
    app.use("/auth", jsonParser, AuthRouter);
    // Route vers la gestion de messagerie instantanée
    app.use("/messages", jsonParser, MessageRouter);
    // Router for contact messenger
    app.use("/messenger-contacts", jsonParser, ContactMessengerRouter);
    // Pour la mise en ligne des images 
    app.use("/upload", jsonParser, UploadRouter);
    // Exposer le dossier /public à travers /static
    app.use('/public', express.static('public'));

    app.use('/calls/', jsonParser, CallRouter)
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use(bodyParser.json());



  } catch (error) {
    console.log(error);
  }
});

// Se connecter à la base de donnée ATLAS
db(); 

// Numéro de port su server
/* A récupérer dans le fichier .env de la racine du dossier "server" */
const port_number = process.env.PORT_NUMBER;
app.listen(port_number, () => { 
  console.log(`Le server est démarré au port : ${port_number} `);
}); 

 