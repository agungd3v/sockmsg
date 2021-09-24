const mongoose = require("mongoose")

module.exports = host => mongoose.connect(host, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})