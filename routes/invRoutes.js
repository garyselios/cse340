// Required
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation")

// Route to display vehicles by classification (with error handling)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to display vehicle detail (with error handling)
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetail))

// Route to display management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to display add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Process add classification
router.post(
  "/add-classification",
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to display add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Process add inventory
router.post(
  "/add-inventory",
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router