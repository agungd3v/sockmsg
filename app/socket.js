const { Server } = require("socket.io")
const socket = new Server({ cors: { origin: "*" } })

const on = (port) => {
  const message = require("./models/message")
  socket.on("connection", (socket) => {
    socket.emit("scnn", { status: true, message: "You are connected!" })
    socket.on("msg", async (msg) => {
      socket.emit("getmsg", { status: true, message: { type: "typing", message: "Typing..." } })
      try {
        const data = new message({ user: msg.user, message: msg.message })
        await data.save()
        socket.emit("getmsg", { status: true, message: { type: "result", message: msg.message } })
      } catch (error) {
        throw error
      }
    })
  })
  socket.listen(port)
}

module.exports = { on }