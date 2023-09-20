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
    unnum: {
        type: String,
        unique: true,
      },
    
    timestamps: true,
  }
);

const Admin = model("Admin", AdminSchema);

module.exports = Admin;