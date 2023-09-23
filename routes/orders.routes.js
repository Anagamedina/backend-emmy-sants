const router = require("express").Router();
const Orders = require('../models/Orders.model');

var mongoose = require('mongoose');

//ruta para crear nuevo pedido 

router.get('/' , async (req, res) => { 
  Orders.find().populate().then(data=>{
    res.send(data)
  }) 
});

router.post("/create", (req, res, next) => { 
  const { products, usuario} = req.body;  

  let productsOID = products.map(p=> new mongoose.Types.ObjectId(p))

  Orders.create({
    products: productsOID, 
    usuario 
  })
    .then((order) => { 
      res.json(order);
    })
    .catch((err) => res.json(err));
});
//


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

//ruta para obtener detalles de un pedido especifico
router.get("/orders/:id", (req, res, next) => {
  let id = req.params.id
  let body = req.body

  Orders.findByIdAndUpdate(id,body).then(data=>{
    res.send(data)
  }) 
});



//ruta para actualizar el estado de un pedido 
router.put("/orders/:id", (req, res, next) => {

});

module.exports = router;