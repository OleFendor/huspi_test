const express = require("express");
const userController = require("../controllers/userController.js");
const authController = require("../controllers/authController.js");

const profileRouter = express.Router();
const { ensureAuthenticated} = require('../middlewares/auth')

profileRouter.get('/', ensureAuthenticated,  userController.getByIdReq)
profileRouter.get('/:id/', ensureAuthenticated,  userController.getById)
profileRouter.post('/edit',ensureAuthenticated,  userController.update)
profileRouter.get('/changepass/:id', ensureAuthenticated, (req, res) => {
    res.render('changePass', {_id: req.user._id})
})
profileRouter.post('/changepass/:id', ensureAuthenticated, authController.changepass)


module.exports = profileRouter;