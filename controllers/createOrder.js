// Controlador para crear un nuevo pedido

const createOrder = (req, res) => {
    const newOrder = new Orders (req.body);
    newOrder.save()
            .then ((savedOrder) => {
                res.json (saveOrder);
    })
    .catch((error)=> {
        res.status(500) .json ({error: 'Error al crear el pedido'});
    });
   
};
module.exports=createOrder;