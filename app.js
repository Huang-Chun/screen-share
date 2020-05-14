const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("passport")

const app = express()

//passport config
require("./config/passport")(passport)

//DB Config
const db = require("./config/keys").MongoURI

//Connect to MONGO
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }) //useUnifiedTopology: true 報錯要我加的
    .then(() => console.log("MongoDB Connect..."))
    .catch(err => console.log(err))
// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

// Bodyparser
app.use(express.urlencoded({ extended: true }))

// EXPRESS SESSION 5500
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash());

// Global variables 給跳出訊息用的
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//Routes
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users")) 

 
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))



