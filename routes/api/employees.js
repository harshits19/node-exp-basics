const express = require("express")
const router = express.Router()
const employeesControler = require("../../controllers/employeesControler")
// const verifyJWT = require("../../middlewares/verifyJWT")

router
  .route("/")
  .get(employeesControler.getAllEmployees)
  .post(employeesControler.createNewEmployee)
  .put(employeesControler.updateEmployee)
  .delete(employeesControler.deleteEmployee)
  
  router.route("/:id").get(employeesControler.getEmployee)
  
  module.exports = router
  // .get(verifyJWT,employeesControler.getAllEmployees)