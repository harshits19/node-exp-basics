const express = require("express")
const router = express.Router()
const path = require("path")

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..","views", "index.html"))
})
//to redirect from specific page
router.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/index") //in redirect, we can specify the status code in first argument
})

module.exports = router
