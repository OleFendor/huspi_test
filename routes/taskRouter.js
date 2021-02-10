const express = require('express');
const taskController = require("../controllers/taskController");
const taskRouter = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/auth')

taskRouter.get('/', ensureAuthenticated, taskController.getByUserId)
taskRouter.get('/:id', ensureAuthenticated,  taskController.getByUserIdParam);
taskRouter.get('/task/:id', ensureAuthenticated, taskController.getById);
taskRouter.get('/task/:id/changestatus',ensureAuthenticated,taskController.changeStatus)
taskRouter.get('/:id/createtask', ensureAuthenticated, (req, res) => {
    res.render('createTask')
})
taskRouter.post('/createtask', ensureAuthenticated, taskController.create)
taskRouter.post('/edit', ensureAuthenticated,  taskController.update);
taskRouter.get('/task/delete/:id', ensureAuthenticated,  taskController.remove);
module.exports = taskRouter