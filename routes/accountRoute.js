// Required
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

/* 
 * Login View Route
 */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* 
 * Registration View Route
 */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* 
 * Process Registration
 */
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* 
 * Process Login  
*/
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* 
 * Account Management View Protected
 */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

module.exports = router