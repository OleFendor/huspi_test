const express = require("express");
const flash = require('express-flash')
const session = require('express-session')
const app = express();
const path = require('path')
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const passport = require("passport")
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
var expressValidator = require('express-validator')
const MongoStore = require('connect-mongo')(session);
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const taskRouter = require("./routes/taskRouter");
const profileRouter = require("./routes/profileRouter");

const keys = require("./config/keys");
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
})   
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser('secret'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore(options)
}))
app.use(flash())
require('./middlewares/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(morgan('dev'));
app.use(cors());

//express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root

    while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
    }
    return {
        param: formParam,
        msg: msg,
        value: value
    }
    }
}))

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user
    next()
})

app.use('/', authRouter)
app.use('/home', (req,res) => {
   if(req.user) {
    if(req.user.role === 'Admin') {
        res.redirect('/admin')
    } else {
        res.redirect('/dashboard/'+req.user._id)
    }
} else {
    res.redirect('/login')
}
})
app.use("/profile", profileRouter)
app.use("/admin", userRouter)
app.use("/login", authRouter)
app.use("/register", authRouter)
app.use("/dashboard", taskRouter)
app.use("/test", (req,res) => {
    res.render('editTask')
    console.log("Start " + req.user._id + " TEST")
})

app.use(function (req, res, next) {
    res.status(404).send("Not Found");
});

const port = process.env.PORT || 3000
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, function(err){
    if(err) return console.log(err);
    app.listen(port, function(){
        console.log("server waiting for connection...");
    });
});
