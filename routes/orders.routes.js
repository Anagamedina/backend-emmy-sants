const router = require("express").Router();
const Orders = require("")

//ruta para crear nuevo pedido 

router.post("api/orders", (req, res, next) => {
  const { produts, usuario, state } = req.body;

  Orders.create ({
    products, 
    usuario, 
    state,
  })
    .then((order) => {
      
      res.json(order);
    })
    .catch((err) => res.json(err));
});


//Ruta para obtener lista de pedidos 
router.get("/api/orders", (req, res, next)=> {
    Orders.find () 
    .then((orders)=> {
        res.json(orders);
}) 
.catch ((error) => {
    res.status(500).json ({ error});
    });
})

//ruta para obtener detalles de un pedido especifico
router.get("api/orders/:id", (req, res, next) => {

});



//ruta para actualizar el estado de un pedido 
router.put("api/orders/:id", (req, res, next) => {

});

module.exports = router;
