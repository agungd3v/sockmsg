const mongoose = require("mongoose")

const message = mongoose.Schema({
  user: {
    type: String,
    require: true
  },
  message: {
    type: String,
    require: true
  },
  created_at: {
    type: Date,
    default: Date()
  }
})

module.exports = mongoose.model('messages', message)