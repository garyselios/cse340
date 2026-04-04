const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")  //

const validate = {}

/* 
 *  Registration Data Validation Rules
 */
validate.registationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* 
 * Check data and return errors or continue to registration
 */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* 
 *  LOGIN VALIDATION RULES  
*/
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail(),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* 
 *  CHECK LOGIN DATA  
  */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
  }
  next()
}

/*  
 *  Update Account Validation Rules
 */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("First name is required."),
    
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),
    
    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
  ];
};

/* 
 * Check update account data
  */
validate.checkUpdateAccountData = async (req, res, next) => {
  const { account_id } = req.body;
  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      accountData
    });
    return;
  }
  next();
};

/*  
 *  Password Update Validation Rules
 */
validate.passwordUpdateRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements.")
  ];
};

/* 
 * Check password update data
 */
validate.checkPasswordUpdateData = async (req, res, next) => {
  const { account_id } = req.body;
  let errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      accountData
    });
    return;
  }
  next();
};

module.exports = validate