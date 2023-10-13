const router = require("express").Router();
const Orders = require('../models/Orders.model');
const mongoose = require('mongoose');
const Storage = require('../models/Storage.model');
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { createStripeSession } = require('../utils/stripeHelper');


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


// Ruta para obtener todos los pedidos (requiere autenticación y ser administrador)
router.get('/' ,   async (req, res) => {
  Orders.find()
    .populate({ path: 'products', populate: { path: 'product' }})
    .then(data=>{
      res.send(data)
      // .populate([
      //   { path: 'products', populate: { path: 'product' } }, // Poblar productos y sus referencias
      //   { path: 'usuario' } // Poblar el usuario
      // ])
      // .then(data => {
      //   res.send(data);
      // })
      // .catch(error => {
      //   res.status(500).send(error);
      });
});


// Ruta para crear un nuevo pedido (borrado el middleware de autenticación temporalmente)
router.post("/create",  isAuthenticated,  async (req, res, next) => {
  // console.log(req.payload);

  const { products ,totalAmount} = req.body;   
  const usuario = req.payload
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

      let stripeSession = await createStripeSession(order._id, Number(totalAmount)); 
      let orderUpdated = await Orders.findByIdAndUpdate(order._id, {strapiID: stripeSession.id}, {new: true})
        
      res.json( orderUpdated )  
    })
    .catch((err) => res.json(err));
});

// CODIGO ALEJANDRO 
//Este es ruta de administradora borraDO TEMPORALMENTE
// router.post("/create", /*isAuthenticated,*/ async (req, res, next) => {
//   const { products, usuario} = req.body;  
//   let stripeSession = await createStripeSession()
// //convertir en ObjetId
//   let productsOID = products.map(p =>({product: new mongoose.Types.ObjectId(p.product), amount:p.amount}))






// Ruta para obtener detalles de un pedido específico
router.get("/orders/:id", (req, res, next) => {
  let id = req.params.id
  Orders.findById(id).then(data=>{
    res.send(data)
  })
});



////enviar por email o sms HABLARLO CON ALEJANDRO 

// // Ruta para actualizar un pedido específico (pendiente de implementar)
// router.put('/orders/:id' , (req, res) => {
//   let id = req.params.id
//   let body = req.body

  
//   // Implementa la lógica de actualización
//   Orders.findByIdAndUpdate(id, body).then(data=>{
//     res.send(data)
//   })
// });

module.exports = router;