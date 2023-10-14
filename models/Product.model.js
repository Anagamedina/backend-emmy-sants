const { Schema, model } = require("mongoose");


const ProductSchema = new Schema(
  {
    nombre: String,
    descripcion: String,
    precio: Number,
    //stock: Number,
    categoria: {
      type: String,
      enum: ["plantas", "ramos"],
    }, 
    imagen: String,  
    aidescripcion: String
  },
  );

const Product = model("Product", ProductSchema);

module.exports = Product;
