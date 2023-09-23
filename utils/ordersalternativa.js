const router = require("express").Router();
const Orders = require('../models/Orders.model');
const mongoose = require('mongoose');
const Product = require('../models/Product.model');

router.post("/create", (req, res, next) => {
    const { products, usuario } = req.body;
  
    verificarStockYCrearPedido(products, usuario)
      .then(() => {
        res.status(201).json({ message: "Pedido creado con éxito" });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
  
  function verificarStockYCrearPedido(products, usuario) {
    const productsOID = products.map(p => ({ product: mongoose.Types.ObjectId(p.product), amount: p.amount }));
  
    return Promise.all(productsOID.map(item => {
      return Product.findById(item.product)
        .then((producto) => {
          if (!producto) {
            throw new Error(`Producto no encontrado: ${item.product}`);
          }
  
          if (producto.stock < item.amount) {
            throw new Error(`Stock insuficiente para ${producto.nombre}`);
          }
  
          // Restar la cantidad pedida del stock del producto
          producto.stock -= item.amount;
  
          // Guardar el producto actualizado en la base de datos
          return producto.save();
        });
    }))
    .then(() => {
      // Luego, crea el pedido en la base de datos después de verificar el stock
      return Orders.create({ products: productsOID, usuario });
    });
  }
  
  // Otras rutas y operaciones (como obtener pedidos, actualizar y eliminar) pueden seguir aquí
  
  module.exports = router;
  

