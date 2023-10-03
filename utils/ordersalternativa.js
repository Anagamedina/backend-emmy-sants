
const router = require("express").Router();
const Orders = require('../models/Orders.model');
var mongoose = require('mongoose');
const Product = require('../models/Product.model');


//Ruta para obtener lista de pedidos
router.get("/orders", (req, res, next)=> {
  Orders.find ()
  .then((orders)=> {
      res.json(orders);  
})
.catch ((error) => {
  res.status(500).json ({ error});
  });
})

// /api/orders 
router.get('/' , async (req, res) => {
  Orders.find()
  .populate({ path: 'products', populate: { path: 'product' }})
  .then(data=>{
    res.send(data)
  })
});


// Ruta para crear un nuevo pedido
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

// Función para verificar el stock y crear el pedido
function verificarStockYCrearPedido(products, usuario) {
  const productsOID = products.map(p => ({
    product: mongoose.Types.ObjectId(p.product),
    amount: p.amount
  }));

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
//

router.get("/testIncrement",async (req, res, next) => {
  // http://localhost:5005/api/products
  // http://localhost:5005/api/orders/testIncrement
      //restar stock 
      let gg = await Product.findByIdAndUpdate ("650b40f868ed4fb9e5adfa96" , { $inc: { stock: -5} })
      res.json(gg)  

 
});
//



//ruta para obtener detalles de un pedido especifico
router.get("/orders/:id", (req, res, next) => {
  let id = req.params.id
  let body = req.body


  Orders.findByIdAndUpdate(id,body).then(data=>{
    res.send(data)
  })
});


router.put('/orders/:id' , (req, res) => {
  let id = req.params.id
  let body = req.body


  Product.findByIdAndUpdate(id,body).then(data=>{
    res.send(data)
  })
});

// Nueva ruta para restar stock de un producto específico en todos los pedidos
router.put('/decrementStock/:productId/:amount', (req, res) => {
  const { productId, amount } = req.params;

  // Restar el stock del producto específico en todos los pedidos
  Orders.updateMany(
    { 'products.product': mongoose.Types.ObjectId(productId) },
    { $inc: { 'products.$.amount': -parseInt(amount) } }
  )
    .then((updatedOrders) => {
      // Verificar si hubo algún pedido actualizado
      if (updatedOrders.nModified > 0) {
        res.json({ message: 'Stock restado en todos los pedidos exitosamente.' });
      } else {
        res.status(404).json({ error: 'Producto no encontrado en ningún pedido.' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error interno del servidor.' });
    });
});









router.delete('/orders/:id', (req, res) => {
  let id = req.params.id


  Product.findByIdAndDelete(id ).then(data=>{
    res.send(data)
  })  
});


module.exports = router;