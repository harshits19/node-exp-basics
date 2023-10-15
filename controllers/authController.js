const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data
  },
}
const fsPromises = require("fs").promises
const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const authenticateUser = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: "username and password required" })
  const userFound = usersDB.users.find((person) => person.username === username)
  if (!userFound) return res.sendStatus(401)
  const isValidPass = await bcrypt.compare(password, userFound.password)
  if (isValidPass) {
    const accessToken = jwt.sign(
      {
        username: userFound.username,
      },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "30s" }
    )
    const refreshToken = jwt.sign(
      {
        username: userFound.username,
      },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: "1d" }
    )
    const otherUsers = usersDB.users.filter((person) => person.username !== userFound.username)
    const currentUser = {
      ...userFound,
      refreshToken,
    }
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(usersDB.users))
    res.cookie("jwt",refreshToken,{httpOnly:true,maxAge: 24*60*60*1000})
    res.json({ accessToken })
  } else res.sendStatus(401)
}

module.exports = { authenticateUser }
