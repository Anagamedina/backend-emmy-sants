//(Controladores para pedidos de administradores)
const Orders = require ('../models/orders');
const getAllOrders = (req, res, next) => {
    Orders.find()
    .then ((orders)=> {
        res.json(orders);
    }) 
    .catch ((error) => {
        res.status(500).json ( {error: 'Error al obtener la lista de pedidos'});
    });
};
module.exports= getAllOrders;