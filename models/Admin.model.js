const { Schema, model } = require("mongoose");

const AdminSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
<<<<<<< HEAD
  
  },
  {
=======
    enum: {
        type: String,
        unique: true,
      },
    
>>>>>>> bf1e1a3d08694de17dffb584f13230e05a38f2bc
    timestamps: true,
  }
);

const Admin = model("Admin", AdminSchema);

module.exports = Admin;
