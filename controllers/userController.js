const User = require("../models/user.js");
const errorHandler = require("../utils/errorHandler");

exports.addUser = function (request, response){
    response.render("register.hbs");
};


exports.getUsers = async function(req, res){
    try {
        if(req.user.role === 'Admin') {
   await User.find({}, function(err, allUsers){
        if(err) {
            console.log(err)
            return res.sendStatus(400)
        }
        res.render("users", {
            users: allUsers
        })

    }).lean()
    } else {
        res.redirect('/dashboard/'+req.user._id)
    }
    } catch(e) {
        errorHandler(e)
    }
  
}




exports.getById = async function(req, res) {
    try {
    const user = await User.findOne({_id: req.params.id}).lean()
        res.render('userInfo', {
            client: user,
            title: 'User page'
        })
} catch(e) {
    errorHandler(res, e);
}
}


exports.getByIdReq = async function(req, res) {
    try {
    const user = await User.findOne({_id: req.user._id}).lean()
        res.render('profile', {
            client: user,
            title: 'User page'
        })
} catch(e) {
    errorHandler(res, e);
}
}

exports.remove = async function(req, res) {
    try {
        await User.remove({_id: req.params.id});
        res.redirect('/admin')

    } catch(e) {
        errorHandler(res,e)
    }
} 

exports.update = async function (req, res) {
    try {
        const user = await User.findOneAndUpdate(
            {_id: req.body._id}, 
            req.body,
            {new: true})
            req.flash('success_msg', `${user.name} edited!`)

            res.redirect('/home')
    } catch(e) {
        errorHandler(res,e)
    }
}

exports.getAllUsers = async function (req, res) {
    try {

    } catch(e) {
        errorHandler(res, e);
    }
}


 

