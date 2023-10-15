const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data
  },
}
const fsPromises = require("fs").promises
const path = require("path")

const handleLogout = async (req, res) => {
  //delete accesstoken on client side

  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) //no content
  const refreshToken = cookies.jwt
  const userFound = usersDB.users.find((person) => person.refreshToken === refreshToken)
  if (!userFound) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    return res.sendStatus(204)
  }
  //delete refreshToken in DB
  const otherUsers = usersDB.users.filter((person) => person.refreshToken !== userFound.refreshToken)
  const currentUser = { ...userFound, refreshToken: "" }
  usersDB.setUsers([...otherUsers, currentUser])
  await fsPromises.writeFile(path.join(__dirname, "..", "model", "users.json"), JSON.stringify(usersDB.users))
  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) //add secure:true on production
  res.sendStatus(204)
}

module.exports = { handleLogout }
