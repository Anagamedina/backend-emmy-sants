// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();
 
// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
var cors = require('cors')

const app = express(); 
app.use(cors())

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const ordersRoutes = require("./routes/orders.routes");
const apiAIRoutes = require("./routes/apiAi.routes");



app.use("/api", indexRoutes);
app.use("/api/products", productsRoutes); 
app.use("/api/apiAi", apiAIRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/auth", authRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
