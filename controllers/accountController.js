const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountController = {}

/* 
 *  Deliver login view
*/
accountController.buildLogin = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* 
 *  Deliver registration view
 */
accountController.buildRegister = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* 
 *  Process Registration
 */
accountController.registerAccount = async function(req, res) {
  let nav = await utilities.getNav()

  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(account_password, 10)

    // Save on DB
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      )
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      return res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }

  } catch (error) {
    console.error("Register error:", error)
    req.flash("notice", "An error occurred during registration.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* 
 *  Process login request
  */
accountController.accountLogin = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  // User does not exist
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    //Compare password
    if (await bcrypt.compare(account_password, accountData.account_password)) {

      // Remove object password
      delete accountData.account_password

      // Create JWT
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 } // 1 hora
      )

      // Guardar cookie
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600000
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600000
        })
      }

      // Success Login
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

  } catch (error) {
  console.error("LOGIN REAL ERROR:", error)
  throw error
}
}

/* 
 *  Account Management View
  */
accountController.buildAccountManagement = async function(req, res) {
  let nav = await utilities.getNav()

  res.render("account/index", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

module.exports = accountController