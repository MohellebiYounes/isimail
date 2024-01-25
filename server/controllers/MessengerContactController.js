const mongoose = require("mongoose");
const MessengerContact = require("../models/MessengerContact");
const User = require("../models/User");

const AddContact = async (req, res) => {
  try {
    // user: Jeanclauss
    User.findOne({email: req.body.email}).then((user)=> {
      // Chercher le contact dans la base de données
      MessengerContact.findOne({contact_id: user._id, user_id: req.body.user_id})
        .then((existingContact) => {
          // Si le contact existe déjà, renvoyer un message d'erreur
          if (existingContact) {
            console.log("contact existe déja")
            res.status(400).json({ message: "Le contact a déjà été ajouté." });
          } else {
            // Sinon, créer le nouveau contact
            const msgContact = new MessengerContact({
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              contact_id: user._id,
              user_id: req.body.user_id,
              user_avatar: user.profile_picture,
              username: user.username,
              username2: req.session.user.username
            });

            // Enregistrer le nouveau contact
            msgContact.save().then(result => {
              res.status(200).json(result);
            });
            console.log("contact créer avec succés")
          }
        });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


const DeleteAll = async (req, res) => {
  try {
    await MessengerContact.deleteMany({})
    res.status(200).send({message: "Success"})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


const DeleteContact = async (req, res) => {
  try {
    
    console.log(req.params.id)
    const filter = { 
      _id: new mongoose.Types.ObjectId(req.params.id) 
    }
    await MessengerContact.findOneAndDelete(filter);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer la conversation entre deux utilisateurs
const GetMyContacts = async (req, res) => {
  try {
    let result = await MessengerContact.find({$or: [{ user_id: req.session.user._id }, { contact_id: req.session.user._id }]});
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const GetAll = async (req, res) => {
  try {
    
    let result = await MessengerContact.find();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
}; 



// Exporter les methodes du module
module.exports = { AddContact, DeleteContact, GetMyContacts, GetAll, DeleteAll};
