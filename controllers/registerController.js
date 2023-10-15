const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data
  },
}
const fsPromises = require("fs").promises
const path = require("path")
const bcrypt = require("bcrypt")

const registerUser = async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: "username and password required" })
  const userCheck = usersDB.users.find((person) => person.username === username)
  if (userCheck) return res.sendStatus(409)
  try {
    const hashedPass = await bcrypt.hash(password, 10)
    const newUser = {
      username: username,
      password: hashedPass,
    }
    usersDB.setUsers([...usersDB.users, newUser])
    await fsPromises.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(usersDB.users))
    console.log(usersDB.users)
    res.status(201).json({ message: `new user ${newUser.username} created` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
module.exports = { registerUser }
