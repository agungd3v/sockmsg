const mongoose = require("mongoose")

module.exports = async host => {
  const conn = await mongoose.createConnection(host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
  }).asPromise()
  return conn.readyState
}