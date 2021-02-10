const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const salt = bcrypt.genSaltSync(10)


exports.main = (req,res) => {
        res.redirect('/login')
}

exports.register = async function(req,res) {
   // res.render('register')
    const candidate = await User.findOne({email: req.body.email});
    if (candidate) {
        req.flash('error_msg', 'Email not avaible')
        res.redirect('/register')
    } else {
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('surname', 'Surname is required').notEmpty()
        req.checkBody('email', 'Email is required').notEmpty()
        req.checkBody('password', 'Password is required').notEmpty()
        let errors = req.validationErrors()
        if(errors) {
            res.render('register', {
                errors: errors
            })
        }

        const password = req.body.password;
        const user = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save();
            req.flash('success_msg', 'You are registered and can now log in')
            res.redirect('/login')
        } catch(e) {
            errorHandler(res,e);

        }
    }
};
exports.getLogin = (req, res) => {
    res.render('login', {
        title: 'Main'
    })
}

exports.changepass = async (req, res) => {
    try {
    const user = await User.findOne({_id: req.params.id})
    const newpass = bcrypt.hashSync(req.body.newpass, salt)
    const isMatch = bcrypt.compare(req.body.oldpass, user.password)
        if(isMatch) {
            await User.findByIdAndUpdate({_id: user._id},
                {password: newpass},
                {new:true})
                console.log(req.body.newpass + bcrypt.hashSync(req.body.newpass, salt))
                req.flash('success_msg', 'Password changed!')
            res.redirect('/home')
        }
        else {
            console.log("BBB")
            req.flash('error_msg', 'Wrong password!')
            res.redirect('/profile/changepass/'+ user._id)


        }
    } catch(e) {
        errorHandler(res, e)
    }
}

exports.afterLogin = (req, res) => {
    if(req.user){
    if(req.user.role === "User") {
        res.redirect('/dashboard/'+ req.user._id)
    } else {
        res.redirect('/admin')
    }
    } else {
    res.redirect('/login')
    }
}

