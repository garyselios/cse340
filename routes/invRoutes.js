// Required
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to display vehicles by classification (with error handling)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to display vehicle detail (with error handling)
router.get("/detail/:invId", utilities.handleErrors(invController.buildVehicleDetail))

module.exports = router