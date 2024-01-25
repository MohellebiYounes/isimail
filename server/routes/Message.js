const express = require('express')
const MessageController = require('../controllers/MessageController')
const MessageRouter = express.Router()

// Routes de la messagerie
MessageRouter.post('/send-message', MessageController.SendMessage)
MessageRouter.post('/create-group', MessageController.CreateGroup)
MessageRouter.get('/get-group/:id', MessageController.GetOneGroup)
MessageRouter.post('/send-toGroup/:id', MessageController.SendMessageToGroup)
MessageRouter.delete('/delete-message/:id', MessageController.DeleteMessage)
MessageRouter.get('/conversation', MessageController.GetConversation)
MessageRouter.get('/', MessageController.GetAll)
MessageRouter.delete('/delete-all/', MessageController.DeleteAll)

// Exportation du router
module.exports = MessageRouter