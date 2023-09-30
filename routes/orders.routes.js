const router = require("express").Router();
const Orders = require('../models/Orders.model');
var mongoose = require('mongoose');
const Product = require('../models/Product.model');
const Storage = require('../models/Storage.model');
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const { isAdmin } = require('../middleware/isLoggedIn');

//Ruta para obtener lista de pedidos


// // Ejemplo de ruta para usuarios regulares
// router.get('/orders/history', isAuthenticated, (req, res) => {
  // req.payload  
//   // Lógica para obtener el historial de pedidos del usuario
//   // y mostrarlo en la página del usuario regular
// });



// router.get("/order/:id",  (req, res, next)=> {
//   Orders.find ()
//   .then((orders)=> {
//       res.json(orders);  
// })
// .catch ((error) => {
//   res.status(500).json ({ error});
//   });
// })




// /api/orders 
router.get('/' , isAuthenticated, isAdmin, async (req, res) => {
  Orders.find()
  .populate({ path: 'products', populate: { path: 'product' }})
  .then(data=>{
    res.send(data)
  })
});




//Este es ruta de administradora por lo de storage?
router.post("/create", isAuthenticated, (req, res, next) => {
  const { products, usuario} = req.body;  
   
//convertir en ObjetId
  let productsOID = products.map(p =>({product: new mongoose.Types.ObjectId(p.product), amount:p.amount}))
  Orders.create({
    products: productsOID,
    usuario
  }).then((order) => {
 
      console.log(products);
      products.map(({product, amount}) => { 
        return Storage.findOneAndUpdate({product:product} , { $inc: { amount: -amount} }).then(x=>{
          console.log(x);
        })
      }) 

  
      res.json(order)  


    })
    .catch((err) => res.json(err));
});

//localhost3000/orderFInish?orderid=lksdafdasdnpasdjasdadasd


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
// router.put('/decrementStock/:productId/:amount', (req, res) => {
//   const { productId, amount } = req.params;

//   // Restar el stock del producto específico en todos los pedidos
//   Orders.updateMany(
//     { 'products.product': mongoose.Types.ObjectId(productId) },
//     { $inc: { 'products.$.amount': -parseInt(amount) } }
//   )
//     .then((updatedOrders) => {
//       // Verificar si hubo algún pedido actualizado
//       if (updatedOrders.nModified > 0) {
//         res.json({ message: 'Stock restado en todos los pedidos exitosamente.' });
//       } else {
//         res.status(404).json({ error: 'Producto no encontrado en ningún pedido.' });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ error: 'Error interno del servidor.' });
//     });
// });

router.delete('/orders/:id', (req, res) => {
  let id = req.params.id


  Product.findByIdAndDelete(id ).then(data=>{
    res.send(data)
  })  
});


module.exports = router;