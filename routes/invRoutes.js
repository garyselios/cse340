// Required
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to display vehicles by classification
router.get("/type/:classificationId", invController.buildByClassificationId)

module.exports = router