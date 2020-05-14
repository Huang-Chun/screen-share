const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomid: {
    type: String,
    required: true
},
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;