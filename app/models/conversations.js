const mongoose = require("mongoose")

const conversations = mongoose.Schema({
  is_user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "users"
    }
  ],
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

module.exports = mongoose.model("conversations", conversations)