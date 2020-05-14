const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")  //到資料庫查資料登入
const bcrypt = require("bcryptjs") //解密密碼驗證

// Load User Model
const User = require("../models/User")

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email"}, (email, password, done) =>{
            //Match User
            User.findOne({email: email})
                .then(user => {
                    if(!user){
                        return done(null, false, {message: "that email is not registered"})
                    }

                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) =>{
                        if(err) throw err

                        if(isMatch) {
                            return done(null, user) //對應上面return done厚面是false，這次match到了市return user
                        } else {
                            return done(null, false, { message: "that password is incorrect" })
                        }
                    })//user.password市hashed
                })
                .catch(err => console.log(err))
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
    
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user)
        })
      })

}