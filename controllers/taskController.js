const Task = require("../models/task.js");
const errorHandler = require("../utils/errorHandler");

exports.create = async function(req, res) {
    try {
        const task = await new Task({
            name: req.body.name,
            description: req.body.description,
            date: req.body.date,
            user: req.user._id
        }).save()
       res.redirect('/dashboard/'+task.user)
    } catch(e) {
        errorHandler(res,e);
    }
}

exports.remove = async function(req,res) {
    try {
        const task = await Task.findByIdAndRemove({_id: req.params.id});
        req.flash('error_msg', `${task.name} deleted!`)

        res.redirect('/dashboard/'+ task.user)
    } catch(e) {
        errorHandler(res,e);
    }
}

exports.update = async function(req,res) {
    try {
        console.log(req.body.name + ' ' + req.body._id)
        const task = await Task.findOneAndUpdate({_id: req.body._id},{
        'name' : req.body.name,
        'description' : req.body.description,
        'date' : req.body.date,
        'status' : req.body.status},
        {new:true})
        req.flash('success_msg', `${req.body.name} edited!`)
        res.redirect('/dashboard/'+ task.user)
    } catch(e) {
        errorHandler(res,e);
    }
}

exports.getByUserId = async function(req,res) {
    try {
        const tasks = await Task.find({
            user: req.user._id
        }).lean()
       res.render("dashboard", {
        tasks: tasks,
        id: req.user._id,
    })
    console.log(req.user.email + ' tasks')

    } catch(e) {
        errorHandler(res,e);
    }
}

exports.changeStatus = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id})
            await Task.findByIdAndUpdate(
                {_id: task._id},
                {'status': !task.status},
                {new: true}
            )
        res.redirect('/dashboard/'+ task.user)
    } catch(e) {
        errorHandler(e)
    }
}

exports.getByUserIdParam = async function(req,res) {
    try {
        const tasks = await Task.find({
            user: req.params.id
        }).lean()
       res.render("dashboard", {
        tasks: tasks,
        id: req.params.id,
    })

    } catch(e) {
        errorHandler(res,e);
    }
}

exports.getById = async function(req, res) {
    try{
        const task = await Task.findOne({
            _id: req.params.id
        })
        res.render('editTask', {
            name: task.name,
            description: task.description,
            date: task.date,
            status: task.status,
            id: task._id
        })
    } catch(e) {
        errorHandler(res,e);
    }
}