const { Server } = require("socket.io")
const socket = new Server({ cors: { origin: "*" } })

const { changePhoto, updateUserPhoto, deletePhoto, searchUser } = require('./utils/user')
const { getConversation, listConversation, InMessage } = require('./utils/conversation')
const { register, login } = require("./utils/auth")

const on = (port) => {
  socket.on("connection", (socket) => {
    // Register
    socket.on("register", async payload => {
      const signup = await register(payload)
      socket.emit("logregister", signup)
    })
    // Login
    socket.on("login", async payload => {
      const signin = await login(payload)
      socket.emit("loglogin", signin)
    })
    // User change photo
    socket.on("changePhoto", (payload, user) => {
      if (user.photo) {
        deletePhoto(user.photo).then(respx => { if (!respx.status) console.log(respx.message) })
      }
      changePhoto(payload, user.id).then(respg => {
        if (respg.status == 200) {
          updateUserPhoto(user.id, respg.data.id).then(resp => {
            socket.emit("photo_changed", resp)
          })
        }
      })
    })
    // Search user
    socket.on('search', value => {
      searchUser(value.keyword).then(data => {
        socket.emit("resultsearch", data)
      }).catch(err => {
        console.log(err)
      })
    })
    // Get Conversations
    socket.on('conversation', value => {
      getConversation(value.from, value.to).then(data => {
        socket.emit("start_conversation", data)
      })
    })
    // Join Conversations
    socket.on("join_conversation", (ray, rayData) => {
      socket.join(ray)
      socket.to(ray).emit("start_message", rayData)
    })
    // In Message
    socket.on("in_message", (ray, msg) => {
      InMessage(ray, msg).then(data => {
        socket.join(ray)
        socket.to(ray).emit("comming_message", data)
      })
    })
    // Lists Conversation
    socket.on("lists_conversation", userid => {
      listConversation(userid).then(data => {
        socket.emit("lists_comming", data)
      })
    })
  });
  socket.listen(port)
}

module.exports = { on }