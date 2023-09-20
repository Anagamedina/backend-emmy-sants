const {, model } = require("mongoose");
const { userSchema } = require("./userSchema");


const User = model("User", userSchema);

module.exports = User;
