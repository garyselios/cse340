/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
<<<<<<< HEAD
const expressLayouts = require("express-ejs-layouts")
=======
>>>>>>> 643192ea2c9358840d7613123e628d57b505e40e
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

<<<<<<< HEAD
/* ******************************************
 * View Engine and Templates
 * ***************************************** */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

=======
>>>>>>> 643192ea2c9358840d7613123e628d57b505e40e
/* ***********************
 * Routes
 *************************/
app.use(static)

/* ***********************
<<<<<<< HEAD
 * Index Route
 *************************/
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" })
})

/* ***********************
=======
>>>>>>> 643192ea2c9358840d7613123e628d57b505e40e
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
<<<<<<< HEAD

=======
>>>>>>> 643192ea2c9358840d7613123e628d57b505e40e
