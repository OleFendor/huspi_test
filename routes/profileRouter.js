const express = require("express");
const userController = require("../controllers/userController.js");
const profileRouter = express.Router();
const { ensureAuthenticated} = require('../middlewares/auth')

profileRouter.get('/', ensureAuthenticated,  userController.getByIdReq)
profileRouter.get('/:id/', ensureAuthenticated,  userController.getById)
profileRouter.post('/edit',ensureAuthenticated,  userController.update)


module.exports = profileRouter;