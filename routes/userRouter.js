const express = require("express");
const userController = require("../controllers/userController.js");
const taskController = require("../controllers/taskController");
const userRouter = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth')

userRouter.get('/',ensureAdmin, userController.getUsers);
userRouter.get('/user/:id/', ensureAdmin,  userController.getById);
userRouter.get('/delete/:id',ensureAdmin,  userController.remove);
userRouter.post('/edit',ensureAdmin,  userController.update);
userRouter.get('/:id/createTask',ensureAdmin, (req,res) => {
    res.render('createTask')
})
userRouter.post('/createTask',ensureAdmin, taskController.create)
userRouter.get('/:id/tasks',ensureAdmin, taskController.getByUserIdParam)
module.exports = userRouter;