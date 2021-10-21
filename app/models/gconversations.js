const mongoose = require("mongoose")

const gconversations = mongoose.Schema({
  is_user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  is_admin: [
    {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "users"
    }
  ],
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    default: null
  },
  photo: {
    type: String,
    default: null
  },
  messages: [
    {
      is_user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "users"
      },
      message: {
        type: String,
        default: ''
      },
      created_at: {
        type: Date,
        default: Date()
      }
    }
  ],
  created_at: {
    type: Date,
    default: Date()
  }
})

module.exports = mongoose.model("gconversations", gconversations)