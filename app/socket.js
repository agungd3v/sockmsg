const { Server } = require("socket.io")
const socket = new Server({ cors: { origin: "*" } })

const { changePhoto, getUser, searchUser } = require('./utils/user')
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
    socket.on("changePhoto", payload => {
      changePhoto(payload).then(data => {
        socket.emit("rgdrive", {
          type: 'success',
          message: data
        })
      }).catch(error => {
        socket.emit("rgdrive", {
          type: 'error',
          message: error.message
        })
      })
    })
    // User get data
    socket.on("getUser", () => {
      getUser().then(response => {
        if (response.status) {
          socket.emit("rgdrive", {
            type: "success",
            message: response.data
          })
        } else {
          socket.emit("rgdrive", {
            type: "Failed",
            message: response.statusText
          })
        }
      }).catch(error => {
        socket.emit("rgdrive", {
          type: "error",
          message: error.message
        })
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