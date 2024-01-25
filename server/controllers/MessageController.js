const mongoose = require("mongoose");
const Message = require("../models/Message");
const Group = require("../models/Group");


const SendMessage = async (req, res) => {
  try {
      const msg = new Message(req.body);
      await msg.save();
      res.status(200).json(msg);
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
  }
}

const SendMessageToGroup = async (req, res) => {
  try {
    const  groupId  = req.params.id;
    const messageContent = req.body.messageContent;
    console.log(groupId)

    // Vérifier si le groupe existe en utilisant son ID
    const filter = { 
      _id: new mongoose.Types.ObjectId(groupId) 
    };

    const group = await Group.findOne(filter);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    // Créer le message pour le groupe
    const newMessage = new Message({
      
      sender_id: "657472ec7c4a3635285df6b5", // Expéditeur du message
      receiver_id: groupId, // L'identifiant du groupe sera le récepteur
      content: messageContent,
      group_id: groupId, // Ajouter l'identifiant du groupe dans le message
    });
    console.log("message crée")

    // Enregistrer le message dans la base de données
    await newMessage.save();
    console.log(group)


    // Ajouter ce message au groupe
    group.messages.push(newMessage);
    await group.save();

    res.status(200).json({ message: 'Message sent to the group successfully.' });
  } catch (error) {
    console.error('Error sending message to the group:', error);
    res.status(500).json({ message: 'Failed to send message to the group.' });
  }
};
// Permet d'envoyer un message instantané
const SendNoSocketMessage = async (req, res) => {
  try {
        const usr = new User(req.body);
        usr.save();
        res.status(200).json(usr);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un message instantané
const DeleteMessage = async (req, res) => {
  try {
    console.log(req.params.id)
    const filter = { 
      _id: new mongoose.Types.ObjectId(req.params.id) 
    }
    await Message.findOneAnd(filter);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const DeleteAll = async (req, res) => {
  try {
    console.log(req.params.id)
    
    await Message.deleteMany({})
    res.status(200).send({message: "Success"})
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer la conversation entre deux utilisateurs
const GetConversation = async (req, res) => {
  try {
    const filter = { conversation_id: req.query.conversation_id };         
    result = await Message.find(filter); 
    res.send(result);
  } catch (error) { 
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer la conversation entre deux utilisateurs
const GetAll = async (req, res) => {
  try {
    let result = await Message.find();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


// Récupérer un utilisateur grâce à son identifiant de document
const GetOne = async (req, res) => {
  try {
    let filter = { _id: new mongoose.Types.ObjectId(req.params.id) };
    let result = await User.findOne(filter);
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const GetOneGroup = async (req, res) => {
  try {
    console.log("je suis ici")
    const groupId = req.params.id;
    console.log(groupId)
    
    // Vérifier si l'ID du groupe est valide
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      console.log("id erroné")
      return res.status(400).json({ message: 'ID de groupe invalide.' });
    }

    const filter = { 
      _id: new mongoose.Types.ObjectId(groupId) 
    };

    const result = await Group.findOne(filter);
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};



const CreateGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;
    const newGroup = new Group({ name: groupName, members });
    await newGroup.save();
    res.status(200).json(newGroup);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Récupération de tous les groupes
const GetAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Récupération des membres d'un groupe
const GetGroupMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: 'Groupe non trouvé' });
    }

    res.status(200).json(group.members);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Ajout d'un membre à un groupe
const AddMemberToGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: 'Groupe non trouvé' });
    }

    res.status(200).json(updatedGroup.members);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Suppression d'un message d'un groupe
const DeleteGroupMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await Message.findByIdAndRemove(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    res.status(200).json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// Exporter les methodes du module
module.exports = { SendMessage,GetOneGroup,SendMessageToGroup,CreateGroup,GetAllGroups,GetGroupMembers,AddMemberToGroup, DeleteGroupMessage, DeleteMessage, GetConversation, GetOne, GetAll, DeleteAll};
