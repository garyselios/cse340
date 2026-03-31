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
accountController.buildManagement = async function(req, res) {
  let nav = await utilities.getNav()
  
  // Get account data from locals (set by JWT middleware)
  const accountData = res.locals.accountData
  
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData,
    errors: null,
  })
}

/*
 *  Logout user
*/
accountController.logout = async function(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
};

/* 
 *  Build update account view (única versión)
 */
accountController.buildUpdateAccount = async function(req, res, next) {
  const account_id = parseInt(req.params.account_id);
  let nav = await utilities.getNav();
  
  // Verify that the user is updating their own account
  if (account_id !== res.locals.accountData?.account_id) {
    req.flash("notice", "You can only update your own account.");
    return res.redirect("/account/management");
  }
  
  const accountData = await accountModel.getAccountById(account_id);
  
  if (!accountData) {
    req.flash("notice", "Account not found.");
    return res.redirect("/account/management");
  }
  
  res.render("account/update", {
    title: "Update Account",
    nav,
    accountData,
    errors: null
  });
};

/*
 *  Process account update
  */
accountController.updateAccount = async function(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  
  // Check if email already exists for another account
  const existingAccount = await accountModel.getAccountByEmail(account_email);
  if (existingAccount && existingAccount.account_id !== parseInt(account_id)) {
    req.flash("notice", "This email is already in use by another account.");
    const accountData = await accountModel.getAccountById(account_id);
    return res.render("account/update", {
      title: "Update Account",
      nav,
      accountData,
      errors: null
    });
  }
  
  const updatedAccount = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  
  if (updatedAccount) {
    req.flash("notice", "Your account information has been updated successfully.");
    // Clear JWT cookie to force re-login with updated data
    res.clearCookie("jwt");
    res.redirect("/account/login");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    const accountData = await accountModel.getAccountById(account_id);
    res.render("account/update", {
      title: "Update Account",
      nav,
      accountData,
      errors: null
    });
  }
};

/* 
 *  Process password update
*/
accountController.updatePassword = async function(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;
  
  const hashedPassword = await bcrypt.hash(account_password, 10);
  
  const updatedAccount = await accountModel.updatePassword(account_id, hashedPassword);
  
  if (updatedAccount) {
    req.flash("notice", "Your password has been updated successfully. Please log in again.");
    // Clear JWT cookie to force re-login
    res.clearCookie("jwt");
    res.redirect("/account/login");
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    const accountData = await accountModel.getAccountById(account_id);
    res.render("account/update", {
      title: "Update Account",
      nav,
      accountData,
      errors: null
    });
  }
};

module.exports = accountController