const mongoose = require("mongoose")

const user = mongoose.Schema({
  fullname: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  phone: {
    type: String,
    require: true,
    unique: true
  },
  photo: {
    type: String,
    default: null
  },
  password: {
    type: String,
    require: true,
    select: false
  },
  created_at: {
    type: Date,
    default: Date()
  }
})

module.exports = mongoose.model("users", user)