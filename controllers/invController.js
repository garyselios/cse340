/* required */
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invController = {};

/* Build inventory by classification safely */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId);
    
    // Obtener filtros de precio desde la query string (ej: ?min=10000&max=50000)
    const minPrice = req.query.min ? parseInt(req.query.min) : 0;
    const maxPrice = req.query.max ? parseInt(req.query.max) : 99999999;
    
    let data;
    
    // Si hay filtro de precio activo (min > 0 o max < 99999999)
    if (minPrice > 0 || maxPrice < 99999999) {
      data = await invModel.getInventoryByPriceRange(classification_id, minPrice, maxPrice);
    } else {
      data = await invModel.getInventoryByClassificationId(classification_id);
    }
    
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Classification";
    
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      minPrice,
      maxPrice,
      classification_id
    });
  } catch (error) {
    console.error("Error in buildByClassificationId:", error);
    next(error);
  }
};

/* Build vehicle detail safely */
invController.buildVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId);
    const vehicle = await invModel.getVehicleById(inv_id);
    if (!vehicle) {
      return next({ status: 404, message: "Vehicle not found" });
    }
    const detailHTML = await utilities.buildVehicleDetail(vehicle);
    let nav = await utilities.getNav();
    const title = `${vehicle.inv_make} ${vehicle.inv_model}`;
    res.render("./inventory/detail", {
      title,
      nav,
      detailHTML,
    });
  } catch (error) {
    console.error("Error in buildVehicleDetail:", error);
    next(error);
  }
};

/* Build management view safely */
invController.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
    });
  } catch (error) {
    console.error("Error in buildManagement:", error);
    next(error);
  }
};

/* Build add classification view safely */
invController.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name: "",
    });
  } catch (error) {
    console.error("Error in buildAddClassification:", error);
    next(error);
  }
};

/* Process add classification safely */
invController.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);
    if (result && result.rowCount > 0) {
      req.flash("notice", `Classification "${classification_name}" was added successfully.`);
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, the classification could not be added.");
      res.redirect("/inv/add-classification");
    }
  } catch (error) {
    console.error("Error in addClassification:", error);
    next(error);
  }
};

/* Build add inventory view safely */
invController.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
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
    });
  } catch (error) {
    console.error("Error in buildAddInventory:", error);
    next(error);
  }
};

/* Process add inventory safely */
invController.addInventory = async function (req, res, next) {
  try {
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
    } = req.body;

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
    );

    if (result && result.rowCount > 0) {
      req.flash("notice", `Vehicle "${inv_make} ${inv_model}" was added successfully.`);
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, the vehicle could not be added.");
      res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    console.error("Error in addInventory:", error);
    next(error);
  }
};

/* Get inventory JSON safely */
invController.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id) || [];
    if (invData.length > 0) {
      return res.json(invData);
    } else {
      next({ status: 404, message: "No data returned" });
    }
  } catch (error) {
    console.error("Error in getInventoryJSON:", error);
    next(error);
  }
};

/* Build edit inventory view safely */
invController.buildEditInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);

    if (!itemData) {
      return next({ status: 404, message: "Vehicle not found" });
    }

    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      ...itemData,
    });
  } catch (error) {
    console.error("Error in buildEditInventory:", error);
    next(error);
  }
};

/* Update inventory */
invController.updateInventory = async function (req, res, next) {
  try {
    console.log("BODY:", req.body)
    let nav = await utilities.getNav();
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    if (updateResult) {
      const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
      req.flash("notice", `The ${itemName} was successfully updated.`);
      res.redirect("/inv/");
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id);
      req.flash("notice", "Sorry, the update failed.");
      res.status(501).render("inventory/edit-inventory", {
        title: `Edit ${inv_make} ${inv_model}`,
        nav,
        classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
      });
    }
  } catch (error) {
    console.error("Error in updateInventory:", error);
    next(error);
  }
};

/* Build delete confirmation view */
invController.buildDeleteConfirmation = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const vehicle = await invModel.getVehicleById(inv_id);
    
    if (!vehicle) {
      return next({ status: 404, message: "Vehicle not found" });
    }
    
    let nav = await utilities.getNav();
    const vehicleName = `${vehicle.inv_make} ${vehicle.inv_model}`;
    
    res.render("inventory/delete-confirm", {
      title: `Delete ${vehicleName}`,
      nav,
      vehicle,
      errors: null,
    });
  } catch (error) {
    console.error("Error in buildDeleteConfirmation:", error);
    next(error);
  }
};

/* Process delete inventory item */
invController.deleteInventoryItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const deletedVehicle = await invModel.deleteInventoryItem(inv_id);
    
    if (deletedVehicle) {
      const vehicleName = `${deletedVehicle.inv_make} ${deletedVehicle.inv_model}`;
      req.flash("notice", `Vehicle "${vehicleName}" was successfully deleted.`);
      res.redirect("/inv/");
    } else {
      req.flash("notice", "Sorry, the vehicle could not be deleted.");
      res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    console.error("Error in deleteInventoryItem:", error);
    next(error);
  }
};

module.exports = invController;