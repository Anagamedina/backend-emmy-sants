const router = require("express").Router();
const Orders = require('../models/Orders.model');
var mongoose = require('mongoose');
const Product = require('../models/Product.model');
const Storage = require('../models/Storage.model');


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


router.post("/create", (req, res, next) => {
  const { products, usuario} = req.body;  
   
  // console.log(products);
  //     products.map(({product, amount}) =>{
  //       console.log(product,amount);

  //       // Storage.findByIdAndUpdate({product:product} , { $inc: { "amount": -amount} }).then(x=>{
  //       //   console.log(x);
  //       // })
  //       let oid =  mongoose.Types.ObjectId
  //       Storage.find( {product: product}   ).then(x=>{
  //         console.log(x);
  //       })
  //     }) 

  // return
//convertir en ObjetId
  let productsOID = products.map(p =>({product: new mongoose.Types.ObjectId(p.product), amount:p.amount}))
  Orders.create({
    products: productsOID,
    usuario
  }).then((order) => {
      
      //restar stock 
      // products.map(({product,amount}) =>{
      //   Product.findByIdAndUpdate(product , { $inc: { stock: -amount} }).then(x=>{
      //     console.log(x);
      //   })
      // }) 
      console.log(products);
      products.map(({product, amount}) =>{
        console.log(product);

        Storage.findOneAndUpdate({product:product} , { $inc: { amount: -amount} }).then(x=>{
          console.log(x);
        })
      }) 

  
      res.json(order)  


    })
    .catch((err) => res.json(err));
});
//operador de actualización en MongoDB que se utiliza para incrementar o decrementar el valor de un campo numérico 

router.get("/testIncrement",async (req, res, next) => {
  // http://localhost:5005/api/products
  // http://localhost:5005/api/orders/testIncrement
      //restar stock 
      let gg = await Product.findByIdAndUpdate ("650b40f868ed4fb9e5adfa96" , { $inc: { stock: -5} })
      res.json(gg)  

 
});


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