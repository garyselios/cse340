// Required
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to display login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to display registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
)

// Logout
router.get("/logout", utilities.handleErrors(accountController.logout))

// Update account view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateAccount))

// Process account update
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password update
router.post(
  "/update-password",
  regValidate.passwordUpdateRules(),
  regValidate.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router