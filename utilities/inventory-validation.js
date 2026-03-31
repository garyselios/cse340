
const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/*
 * Classification Data Validation Rules
 */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isLength({ min: 1 })
      .withMessage("Classification name must be at least 1 character.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage(
        "Classification name must contain only letters and numbers, no spaces or special characters."
      ),
  ]
}

/* 
 * Check classification data
 */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
  }
  next()
}

/*
 * Inventory Data Validation Rules
 *  */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification."),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required.")
      .isLength({ min: 1 })
      .withMessage("Make must be at least 1 character."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required.")
      .isLength({ min: 1 })
      .withMessage("Model must be at least 1 character."),

    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year is required.")
      .matches(/^\d{4}$/)
      .withMessage("Year must be a 4-digit number (e.g., 2020)."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a number greater than or equal to 0."),

    body("inv_miles")
      .notEmpty()
      .withMessage("Miles is required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be an integer greater than or equal to 0."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required."),
  ]
}

/* 
 * Check inventory add data
 */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    return res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationList,
      ...req.body,
    })
  }
  next()
}

/* 
 * Check inventory update data
 */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id)
    return res.render("inventory/edit-inventory", {
      title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
      nav,
      classificationSelect,
      errors,
      ...req.body,
    })
  }
  next()
}

module.exports = validate