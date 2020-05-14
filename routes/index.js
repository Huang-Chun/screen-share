const express = require('express')
const router = express.Router()
const {ensureAuthenticated} = require("../config/auth")

const Room = require("../models/Room") //call room model


// welcome page
router.get('/',  (req, res) => res.render('welcome'))

//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
    name: req.user.name
}))


router.get("/dashboard/:roomid", function(req, res){
    res.send("this is your room id " + req.params.roomid)
})

// router.post('/dashboard', function (req, res) {
//   res.json('{ success: true }')
// })

////////////



//Create Room
router.post("/index/dashboard", (req, res) => {
    
    
    const roomid = +new Date()        //取亂數
    const password = JSON.stringify(req.body)
    const newRoom = new Room({
        roomid: roomid, 
        
        password: password
      })
      newRoom.save(function (err) {
        if (err) return errorHandle(err)
        else console.log("successfully insert!")
        
      })
    router.get("/index/dashboard/"+ roomid ,  function(req, res){
        res.send("this is your room id " + roomid)
    })

})

// router.get("/" + roomid ,  function(req, res){
//   res.send("this is your room id " + roomid)
// })



module.exports = router