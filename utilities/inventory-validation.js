const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/* 
 *  Classification Data Validation Rules
 */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name must contain only letters and numbers, no spaces or special characters."),
  ]
}

/*
 * Check inventory data and return errors or continue
 */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)

    res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

/* 
 * Check classification data and return errors or continue
 */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* 
 *  Inventory Data Validation Rules
 */
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

module.exports = validate