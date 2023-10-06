const router = require("express").Router();
const Orders = require('../models/Orders.model');
const mongoose = require('mongoose');
const Storage = require('../models/Storage.model');
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { createStripeSession } = require('../utils/stripeHelper');
const stripeRoutes = require('./stripe.routes'); // Importa stripe.routes.js


// Ruta para obtener el historial de pedidos de usuarios regulares
router.get('/history', isAuthenticated, async (req, res) => {
  const userId = req.payload._id;
  console.log(req.payload);
  try {
    
    const userOrders = await Orders.find({ usuario: userId })
    .populate({ path: 'products', populate: { path: 'product' }})

    res.send(userOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el historial de pedidos.' });
  }
});

//USUARIOS REGULARES
// gabriela@gmail.com
// @Holamundo15
//perez@gmail.com

// Ruta para obtener todos los pedidos (requiere autenticación y ser administrador)
router.get('/' ,   async (req, res) => {
  Orders.find()
    .populate({ path: 'products', populate: { path: 'product' }})
    .then(data=>{
      res.send(data)
    })
});


// Ruta para crear un nuevo pedido (borrado el middleware de autenticación temporalmente)
router.post("/create", /*isAuthenticated,*/ async (req, res, next) => {
  const { products, usuario} = req.body;   

  // Convertir en ObjectIds y crear el pedido
  let productsOID = products.map(p => ({ product: new mongoose.Types.ObjectId(p.product), amount: p.amount }));
  Orders.create({
    products: productsOID,
    usuario,
    state: "Pendiente",
  }).then(async (order) => { 
      // Actualiza la cantidad de productos en el almacen
      products.map(({ product, amount }) => { 
        return Storage.findOneAndUpdate({ product: product }, { $inc: { amount: -amount } }).then(x=>{ console.log(x); })
      })  

      let stripeSession = await createStripeSession(order._id, 22.99); 
      let orderUpdated = await Orders.findByIdAndUpdate(order._id, {strapiID: stripeSession.id}, {new: true})
        
      res.json( orderUpdated )  
    })
    .catch((err) => res.json(err));
});

// Ruta para obtener detalles de un pedido específico
router.get("/orders/:id", (req, res, next) => {
  let id = req.params.id
  Orders.findById(id).then(data=>{
    res.send(data)
  })
});

 


// Ruta para actualizar un pedido específico
router.put('/orders/:id' , async (req, res) => {
  let id = req.params.id;
  let body = req.body;

  try {
    // Implementa la lógica de actualización
    const updatedOrder = await Orders.findByIdAndUpdate(id, body, { new: true });

    // Accede al ID del pedido actualizado desde res.locals de stripe.routes.js
    const updatedOrderIdFromStripe = stripeRoutes.res.locals.updatedOrderId;

    // Realiza acciones adicionales con el ID del pedido actualizado si es necesario
    console.log(`Pedido actualizado con ID: ${updatedOrderIdFromStripe}`);

    res.send(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});


// Ruta para eliminar un pedido específico
router.delete('/orders/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Implementa la lógica de eliminación
    const deletedOrder = await Orders.findByIdAndDelete(id);

    // Accede al ID del pedido eliminado desde res.locals de stripe.routes.js
    const deletedOrderIdFromStripe = stripeRoutes.res.locals.deletedOrderId;

    // Realiza acciones adicionales con el ID del pedido eliminado si es necesario
    console.log(`Pedido eliminado con ID: ${deletedOrderIdFromStripe}`);

    res.send(deletedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});



module.exports = router;
















// // Ruta para actualizar un pedido específico (pendiente de implementar)
// router.put('/orders/:id' , (req, res) => {
//   let id = req.params.id
//   let body = req.body
//   // Implementa la lógica de actualización
//   Product.findByIdAndUpdate(id, body).then(data=>{
//     res.send(data)
//   })
// });

// // Ruta para eliminar un pedido específico (pendiente de implementar)
// router.delete('/orders/:id', (req, res) => {
//   let id = req.params.id
//   // Implementa la lógica de eliminación
//   Product.findByIdAndDelete(id).then(data=>{
//     res.send(data)
//   })  
// });

// module.exports = router;



//localhost3000/orderFInish?orderid=lksdafdasdnpasdjasdadasd