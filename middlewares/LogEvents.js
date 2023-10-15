const fs = require("fs")
const fsPromises = require("fs").promises
const path = require("path")
const { format } = require("date-fns")
const { v4: uuid } = require("uuid") //import { v4 as uuid } from "uuid"
const { dirname } = require("path")
/* Basic function of LogEvents()
    create a log when any event of create log is emitted
    create a new log directory if not exist
    create a new logEvent.txt file inside it and append the logData in it
*/
const LogEvents = async (message, logFileName) => {
  const dateLog = format(new Date(), "dd/MM/yyyy\tHH:mm:ss")
  const logData = `${dateLog}\t${uuid()}\t${message}\n`
  // console.log(logData)
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "Logs"))) 
      await fsPromises.mkdir(path.join(__dirname, "..", "Logs"))
    await fsPromises.appendFile(path.join(__dirname, "..", "Logs", logFileName), logData)
  } catch (err) {
    console.log(err)
  }
}
const logger = (req, res, next) => {
  LogEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt")
  console.log(`${req.method}\t${req.headers.origin}\t${req.url}`)
  next()
}
module.exports = { LogEvents, logger }
