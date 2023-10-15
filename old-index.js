const express = require("express")
const app = express()
const cors = require("cors")
const { LogEvents, logger } = require("./middlewares/LogEvents")
const errorHandler = require("./middlewares/errorHandler")
const EventEmitter = require("events")
const path = require("path")
const PORT = process.env.PORT || 3000

//default middleware
app.use(express.json()) //required to process post/get/put/del request !imp
//middleware to upload whole folder
app.use("/", express.static(path.join(__dirname, "public")))
app.use("/subdir", express.static(path.join(__dirname, "public")))

//using routes for subdir
app.use("/subdir", require("./routes/subdir"))

//custom middleware
/* app.use((req, res, next) => {
  LogEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,"reqLog.txt")
  console.log("custom middleware called")
  next()
}) */
app.use(logger)
//using third party middlewares like cors
const whitelist = ["http://localhost:3000", "https://www.google.com"]
const corsOptions = {
  origin: (origin, callback) => {
    //use !origin in dev only, replace google with your site
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else callback(new Error("Not allowed by cors"))
  },
  // optionsSuccessStatus:200
}
app.use(cors(corsOptions))

app.use("/", require("./routes/root"))
//express supports regex in routes , so we can configure it according to our needs
//in regex, ^ - begin-with, $ - end-with, | - or , (enclose)? - makes param optional
//express automatically adds file types
/* app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"))
})
//to redirect from specific page
app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/index") //in redirect, we can specify the status code in first argument
}) */
//route handlers - to chain the middlewares
//position also matters, if we place this after our 404 handler, then it will display 404 page instead of it
app.get(
  "/pogo(.html)?",
  (req, res, next) => {
    console.log("route handler initiated")
    next()
  },
  (req, res) => {
    res.send("<h1>Route handler middlewares</h1>")
  }
)

//chaining the routes - another middleware
const first = (req, res, next) => {
  console.log("first called")
  next()
}
const second = (req, res, next) => {
  console.log("second called")
  next()
}
const third = (req, res) => {
  console.log("third and last called")
}
//route handlers - to chain the middlewares
app.get("/chain", [first, second, third])

//custom 404
app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html")) //we can chain the status
})

//catching any error while get req (like cors error)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})

/* 
class LogEventClass extends EventEmitter {} //create a sample class for events
const LogEvent = new LogEventClass() //create a new object of class LogEvents
LogEvent.on("log", (message) => {
  LogEvents(message)
})
setTimeout(() => LogEvent.emit("log", "log event emitted!"), 2000)
 */

/* 
Steps to create a server with express js
1. import express
2. define app = express()
3. define a port PORT = process.env.PORT || 3000
4. listen to port on server - app.listen(PORT,()=>{console.log(`listening on port: ${PORT}`)})
5. to make a route -  app.get("route-path",(req,res)=>{ res.send("<h1>hello world</h1>")})
*/
