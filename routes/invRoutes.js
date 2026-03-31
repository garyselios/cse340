const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation")

// Public routes (no authentication required)
// Display vehicles by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetail))

// Management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Get inventory JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Protected routes (require Admin/Employee role)
// Add classification view
router.get("/add-classification", utilities.checkAdmin, utilities.handleErrors(invController.buildAddClassification))

// Add classification process
router.post(
  "/add-classification",
  utilities.checkAdmin,
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add inventory view
router.get("/add-inventory", utilities.checkAdmin, utilities.handleErrors(invController.buildAddInventory))

// Add inventory process
router.post(
  "/add-inventory",
  utilities.checkAdmin,
  regValidate.inventoryRules(),
  regValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Edit inventory view
router.get("/edit/:inv_id", utilities.checkAdmin, utilities.handleErrors(invController.buildEditInventory))

// Update inventory process
router.post(
  "/update",
  utilities.checkAdmin,
  regValidate.inventoryRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Delete inventory confirmation view
router.get("/delete/:inv_id", utilities.checkAdmin, utilities.handleErrors(invController.buildDeleteConfirmation))

// Delete inventory process
router.post(
  "/delete/:inv_id",
  utilities.checkAdmin,
  utilities.handleErrors(invController.deleteInventoryItem)
)

module.exports = router