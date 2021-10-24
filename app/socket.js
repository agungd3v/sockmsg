const { Server } = require("socket.io")
const socket = new Server({ cors: { origin: "*" } })

const { changePhoto, updateUserPhoto, deletePhoto, searchUser } = require('./utils/user')
const { getConversation, listConversation, InMessage } = require('./utils/conversation')
const { createGroup, joinGroup, changeGroupTitle, getGconversation, InGmessage } = require('./utils/gconversation')
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

    // Start single conversation socket
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
        if (data.status) {
          let dtx = []
          if (data.message.user.length > 0) data.message.user.forEach(dmk => dtx.push(dmk))
          if (data.message.group.length > 0) data.message.group.forEach(dmk => dtx.push(dmk))
          socket.emit("resultsearch", dtx)
        }
      })
    })
    // Get Conversations
    socket.on('conversation', value => {
      getConversation(value.from, value.to).then(data => {
        socket.emit("start_conversation", data, 'single')
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
        socket.to(ray).emit("comming_message", data, 'single')
        // Update list for sender
        socket.emit('update_list_after_send_message', data, 'single')
        // Update list for reciver
        socket.broadcast.emit('update_list_after_send_message', data, 'single')
      })
    })
    // Lists Conversation
    socket.on("lists_conversation", userid => {
      listConversation(userid).then(data => {
        socket.emit("lists_comming", data)
      })
    })
    // End single conversation socket

    // Start group conversation socket
    // Create group
    socket.on("makegroup", (info, userid) => {
      createGroup(info, userid).then(dtx => {
        socket.emit("groupcreated", dtx.message)
      })
    })
    socket.on("joingroup", (group, user) => {
      joinGroup(group, user).then(data => {
        socket.emit("start_conversation", data, 'group')
      })
    })
    socket.on("changegrouptitle", (gid, nwt) => {
      changeGroupTitle(gid, nwt).then(dtx => {
        socket.emit("start_conversation", dtx, 'group')
        // Update list for sender
        socket.emit('update_list_after_send_message', dtx, 'group')
        // Update list for reciver
        socket.broadcast.emit('update_list_after_send_message', dtx, 'group')
      })
    })
    socket.on("gconversation", (rayid, userid) => {
      getGconversation(rayid, userid).then(resp => {
        socket.emit("start_conversation", resp, 'group')
      })
    })
    socket.on("join_gconversation", (rayData) => {
      socket.join(rayData._id)
      socket.to(rayData._id).emit("start_gmessage", rayData)
    })
    socket.on("in_gmessage", (ray, msg) => {
      InGmessage(ray, msg).then(data => {
        socket.join(ray)
        socket.to(ray).emit("comming_message", data, 'group')
        // Update list for sender
        socket.emit('update_list_after_send_message', data, 'group')
        // Update list for reciver
        socket.broadcast.emit('update_list_after_send_message', data, 'group')
      })
    })
    // End group conversation socket
  });
  socket.listen(port)
}

module.exports = { on }