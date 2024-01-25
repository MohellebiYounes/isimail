const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: mongoose.Types.ObjectId, ref: 'User' }] ,// Utilisez la référence à votre modèle User

});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;

// on doit ajouter groupId