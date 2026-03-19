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

module.exports = invController