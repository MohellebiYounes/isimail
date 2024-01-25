const express = require('express')
const CallController = require('../controllers/CallController')
const CallRouter = express.Router()

// Routes de la messagerie
CallRouter.post('/initiate-call', CallController.InitiateVideoCall)
CallRouter.get('/hang-up', CallController.HangUp)
CallRouter.get('/fetch-calls', CallController.FetchVideoCalls)
CallRouter.delete('/delete-all', CallController.DeleteAll)

// Exporter le module
module.exports = CallRouter   