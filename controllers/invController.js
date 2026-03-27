const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invController = {}

/* 
 *  Build inventory by classification view
 */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0]?.classification_name || "Classification"
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* 
 *  Build vehicle detail view
 */
invController.buildVehicleDetail = async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicle = await invModel.getVehicleById(inv_id)
  const detailHTML = await utilities.buildVehicleDetail(vehicle)
  let nav = await utilities.getNav()
  const title = `${vehicle.inv_make} ${vehicle.inv_model}`
  res.render("./inventory/detail", {
    title,
    nav,
    detailHTML,
  })
}

/* 
 *  Build management view
 */
invController.buildManagement = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

/* 
 *  Build add classification view
 */
invController.buildAddClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: "",
  })
}

/* 
 *  Process add classification
 */
invController.addClassification = async function(req, res, next) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result.rowCount > 0) {
    req.flash("notice", `Classification "${classification_name}" was added successfully.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the classification could not be added.")
    res.redirect("/inv/add-classification")
  }
}

/* 
 *  Build add inventory view
 */
invController.buildAddInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
  })
}

/* 
 *  Process add inventory
 */
invController.addInventory = async function(req, res, next) {
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

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (result.rowCount > 0) {
    req.flash("notice", `Vehicle "${inv_make} ${inv_model}" was added successfully.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the vehicle could not be added.")
    res.redirect("/inv/add-inventory")
  }
}

module.exports = invController