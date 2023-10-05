require("dotenv").config();
require("./db");
const express = require("express");
var cors = require('cors')
const Stripe = require("stripe");
// const stripe = new Stripe("<your_secretkey_here>");

const app = express(); 
app.use(cors())

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const ordersRoutes = require("./routes/orders.routes");
const apiAIRoutes = require("./routes/apiAi.routes");
const stripeRoutes = require("./routes/stripe.routes");


app.use("/api", indexRoutes);
app.use("/api/products", productsRoutes); 
app.use("/api/apiAi", apiAIRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/auth", authRoutes);
app.use("/api/stripe", stripeRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
