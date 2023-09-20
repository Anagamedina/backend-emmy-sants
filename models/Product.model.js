const { Schema, model } = require("mongoose");


const ProductSchema = new Schema(
  {
    nombre: String,
    descripcion: String,
    precio: Number,
    stock: Number,
    categoria: String, 
    imagen: String, // URL de la imagen del producto
  
  });

const Product = model("Product", ProductSchema);

module.exports = Product;


  