const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require("passport")

//User model
const User = require("../models/User") //call user model

//Login page
router.get('/login',  (req, res) => res.render('login'))

//Register page
router.get('/register',  (req, res) => res.render('register'))

// DOWNLOAD
// router.get("/downloading", function(req, res, next){
//   res.download("IU.jpg")
// })

// Register Handle
router.post("/register", (req, res) => {
    const { name, email, password, password2  } = req.body
    let errors = [];

    // check required field
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if(errors.length > 0){
    res.render("register", {
        errors,
        name, 
        email, 
        password,
        password2
    })
  }else{
      //validation passed 
      User.findOne({email: email})
        .then(user => {
          if(user){
            // user exist
            errors.push({msg: "email is already registered"})
            res.render("register", {
              errors,
              name, 
              email, 
              password,
              password2
          })
          } else{
            const newUser = new User({
              name,
              email,
              password 
            })

            // hash password
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) =>{
              if(err) throw err
              // set password to hashed
              newUser.password = hash
              //save user
              newUser.save()
                .then(user => {
                  req.flash("success_msg", "You are now registered and can log in")
                  res.redirect("/users/login")
                })
                .catch(err => console.log(err))
            }))
          }
        })
  }

})

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

// Logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/login')
})


// 顯示某使用者資料
router.get('/userlist/:id', (req, res) => {
  User.findOne({_id:req.params.id}).lean().exec(function (err, users) {
    return res.send(JSON.stringify(users));
  })
})


//顯示所有使用者資料
router.get('/userlist', (req, res) => {
  User.find().lean().exec(function (err, users) {
    return res.send(JSON.stringify(users));
  })
})




//刪除使用者資料
router.get('/delete/:id', function (req, res, next) {
  const id = req.params.id
  console.log(id)
  User.deleteOne({ _id: id }, function (err) {
    if(err) console.log(err);
    // console.log("Successful deletion");
    res.send("delete"+ id )
  });
})


module.exports = router