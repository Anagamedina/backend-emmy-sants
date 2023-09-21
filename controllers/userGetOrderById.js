// Controlador para obtener detalles de un pedido específico
const getOrderById = (req, res) => {
    const orderId = req.params.id;
  
    Orders.findById(orderId)
      .then((order) => {
        if (!order) {
          return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json(order);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error al obtener detalles del pedido' });
      });
  };
module.exports = getOrderById ;
