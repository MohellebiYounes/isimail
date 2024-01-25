const express = require('express')
const UserController = require('../controllers/UserController')
const UserRouter = express.Router()

// Routes de l'utilisateur
UserRouter.get('/get-user/:id', UserController.GetOne)
UserRouter.put('/:id', UserController.UpdateUser)
UserRouter.put('/update/update-password', UserController.UpdatePassword)
UserRouter.delete('/:id', UserController.DeleteUser)
UserRouter.get('/', UserController.GetAll)
UserRouter.get('/checkUser', UserController.checkUser)
UserRouter.get('/email-part', UserController.GetEmailSearch) 
UserRouter.post('/sendOtp', UserController.SendResetEmail)
UserRouter.post('/resetPass', UserController.ResetPassword) 

// Exporter le module
module.exports = UserRouter   