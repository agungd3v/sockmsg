const { Server } = require("socket.io")
const socket = new Server({ cors: { origin: "*" } })

const on = (port) => {
  const message = require("./models/message")
  socket.on("connection", (socket) => {
    socket.emit("scnn", { status: true, message: { type: "connection", data: "You are connected!" } })
    socket.on("msg", () => {
      socket.emit("getmsg", { status: true, message: { type: "typing", data: "Typing..." } })
    })
    socket.on("inmsg", async (msg) => {
      try {
        const data = new message({ user: msg.user, message: msg.message })
        await data.save()
        socket.emit("getmsg", { status: true, message: { type: "result", data: msg.message } })
      } catch (error) {
        socket.emit("getmsg", { status: true, message: { type: "error", data: "Failed send message, Please contact developer" } })
        throw error
      }
    })
  })
  socket.listen(port)
}

module.exports = { on }