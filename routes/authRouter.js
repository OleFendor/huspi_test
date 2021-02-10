const express = require("express");
const bodyParser = require('body-parser')
const authController = require("../controllers/authController");
const authRouter = express.Router();
const passport = require('passport');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const {forwardAuthenticated} = require('../middlewares/auth')

authRouter.get('/',forwardAuthenticated, authController.main)
authRouter.get('/login',forwardAuthenticated ,(req,res) => {
    res.render('login', {
        title: 'Log in',
        auth: true
    })
})
authRouter.post('/login',  (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: `/authComplete`,
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });
authRouter.get('/authComplete',  authController.afterLogin)
authRouter.get('/register', forwardAuthenticated , (req,res) => {
    res.render('register', {
        title: 'register',
        auth: true
    })
})
authRouter.post("/register", forwardAuthenticated , authController.register)

authRouter.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });


module.exports = authRouter;