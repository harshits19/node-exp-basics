const { LogEvents } = require("./LogEvents")

const errorHandler = (err, req, res, next) => {
  LogEvents(`${err.name}\t${err.message}`, "errLog.txt")
  console.log(err.stack)
  res.status(500).send(err.message)
}
module.exports = errorHandler
