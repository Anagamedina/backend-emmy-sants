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

//????? /api/orders 
router.get('/' , async (req, res) => {
  Orders.find()
  .populate({ path: 'products', populate: { path: 'product' }})
  .then(data=>{
    res.send(data)
  })
});


router.post("/create", (req, res, next) => {
  const { products, usuario} = req.body;  
  

  //check stock
  model.find({
    '_id' : [
        '4ed3ede8844f0f351100000c',
        '4ed3f117a844e0471100000d', 
        '4ed3f18132f50c491100000e'
    ]
}, function(err, docs){
    console.log(docs);
});

//convertir en ObjetIds
  let productsOID = products.map(p =>({product: new mongoose.Types.ObjectId(p.product), amount:p.amount}))
  Orders.create({
    products: productsOID,
    usuario
  })
    .then((order) => {
      
      //restar stock 
      products.map(({product,amount}) =>{
        Product.findByIdAndUpdate(product , { $inc: { stock: -amount} }).then(x=>{
          console.log(x);
        })
      }) 

      res.json(order)  


    })
    .catch((err) => res.json(err));
});
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


router.delete('/orders/:id', (req, res) => {
  let id = req.params.id


  Product.findByIdAndDelete(id ).then(data=>{
    res.send(data)
  })  
});


module.exports = router;

