const express = require("express");
const userController = require("../controllers/userController.js");
const taskController = require("../controllers/taskController");
const userRouter = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/auth')

userRouter.get('/',ensureAuthenticated, userController.getUsers);
userRouter.get('/user/:id/', ensureAuthenticated,  userController.getById);
userRouter.get('/delete/:id',ensureAuthenticated,  userController.remove);
userRouter.post('/edit',ensureAuthenticated,  userController.update);
userRouter.get('/:id/createTask',ensureAuthenticated, (req,res) => {
    res.render('createTask')
    console.log(req.user.email + ' create')
})
userRouter.post('/createTask',ensureAuthenticated, taskController.create)
userRouter.get('/:id/tasks',ensureAuthenticated, taskController.getByUserIdParam)
module.exports = userRouter;