const express = require("express")
const app = express()
const path = require("path")
const { logger } = require("./middlewares/LogEvents")
const PORT = process.env.PORT || 3000
const verifyJWT = require("./middlewares/verifyJWT")
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(logger)
app.use(cookieParser())

app.use("/", express.static(path.join(__dirname, "public")))
 
//using routes for subdir
app.use("/", require("./routes/root"))
app.use("/register", require("./routes/api/register"))
app.use("/auth", require("./routes/api/auth"))
app.use("/refresh", require("./routes/api/refresh"))
app.use("/logout", require("./routes/api/logout"))

app.use(verifyJWT) //after this mw , all the routes are verified
app.use("/employees",require("./routes/api/employees"))

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html")) //we can chain the status
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})
