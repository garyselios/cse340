const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/*
 * Constructs the nav HTML unordered list
 */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();
    if (!data) {
      console.error("Warning: getClassifications returned undefined");
      data = [];
    }
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
    list += "</ul>";
    return list;
  } catch (err) {
    console.error("Error in getNav:", err);
    return "<ul><li><a href='/'>Home</a></li></ul>";
  }
};

/*
 * Build the classification select list
 */
Util.buildClassificationList = async function (classification_id = null) {
  try {
    let data = await invModel.getClassifications();
    if (!data) {
      console.error("Warning: getClassifications returned undefined");
      data = [];
    }
    let classificationList =
      '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"';
      if (classification_id != null && row.classification_id == classification_id) {
        classificationList += " selected ";
      }
      classificationList += ">" + row.classification_name + "</option>";
    });
    classificationList += "</select>";
    return classificationList;
  } catch (err) {
    console.error("Error in buildClassificationList:", err);
    return "<select><option>Choose a Classification</option></select>";
  }
};

/*
 * Build classification grid HTML
 */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<div id="inventoryDisplay">';
    data.forEach((vehicle) => {
      grid += '<div class="vehicle-card">';
      grid +=
        '<img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        '">';
      grid +=
        '<h3><a href="/inv/detail/' +
        vehicle.inv_id +
        '">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a></h3>";
      grid +=
        "<p>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</p>";
      grid += "</div>";
    });
    grid += "</div>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* 
 * Build vehicle detail HTML
 */
Util.buildVehicleDetail = async function (vehicle) {
  let detail = '<div id="vehicle-detail">';
  detail += '<div class="vehicle-image">';
  detail += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`;
  detail += "</div>";

  detail += '<div class="vehicle-info">';
  detail += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
  detail += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`;
  detail += `<p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(
    vehicle.inv_price
  )}</p>`;
  detail += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(
    vehicle.inv_miles
  )} miles</p>`;
  detail += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`;
  detail += `<p><strong>Description:</strong> ${vehicle.inv_description}</p>`;
  detail += "</div>";

  detail += "</div>";
  return detail;
};

/* 
 * JWT check middleware
 */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err, accountData) {
      if (err) {
        res.locals.loggedin = false;
        res.locals.accountData = null;
        return next();
      }
      res.locals.loggedin = true;
      res.locals.accountData = accountData;
      next();
    });
  } else {
    res.locals.loggedin = false;
    res.locals.accountData = null;
    next();
  }
};

/* 
 * Middleware to check if user is Employee or Admin
 */
Util.checkAdmin = (req, res, next) => {
  if (res.locals.loggedin && 
      (res.locals.accountData.account_type === 'Employee' || 
       res.locals.accountData.account_type === 'Admin')) {
    next();
  } else {
    req.flash("notice", "You do not have permission to access this area.");
    res.redirect("/account/login");
  }
};

/* 
 * Error handling middleware wrapper
 */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* 
 * Check login middleware
 */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

module.exports = Util;