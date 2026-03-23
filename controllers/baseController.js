const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res) {
  const nav = await utilities.getNav()
  
//req.flash("notice", "Welcome to CSE Motors! Check out our latest vehicles.")
  
  res.render("index", { title: "Home", nav })
}

module.exports = baseController