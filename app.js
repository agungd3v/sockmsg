require("dotenv/config")

require("./app/config/database")(process.env.DB_HOST)
  .then(() => require("./app/socket").on(process.env.PORT || 3000))
  .catch((error) => false)
