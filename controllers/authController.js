const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');
const passport = require('passport')
const LocalStrategy = require('passport-local')

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

        const salt = bcrypt.genSaltSync(10)
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
           // res.status(201).json(user);
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
exports.login = async function(req, res) {
    
    const candidate = await User.findOne({email: req.body.email});
    if(candidate) {
        if(candidate.living === 'Active'){
        //check password
        const passportResult = bcrypt.compareSync(req.body.password, candidate.password);
        if(passportResult) {
            //generate token
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})
         //  res.setHeader({'Authorization': 'Bearer ' + token})


           if(candidate.role === 'User') {
               req.flash('success_msg', 'Welcome, '+ candidate.name)
            res.redirect('/admin/'+ candidate._id)
           } else {
            req.flash('success_msg', 'Welcome, '+ candidate.name)
                res.redirect('/admin')
           }
           // res.status(200).json({
           //     token: `Bearer ${token}`,
           //     userId: candidate._id
           // })
        } else {
            //password incorrect
            //req.flash('error_msg', 'Password incorrect')
            errors.push({msg: 'Password incorect'})
            res.redirect('/login')
        }
     } else {
        req.flash('error_msg', 'User Inactive')
        res.redirect('/login')

     }
    } else {
        req.flash('error_msg', 'No such user')
        res.redirect('/login')
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

