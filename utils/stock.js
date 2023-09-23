const productosIds = [
    '4ed3ede8844f0f351100000c',
    '4ed3f117a844e0471100000d',
    '4ed3f18132f50c491100000e'
];

Producto.find({ '_id': { $in: productosIds } }, function(err, productos) {
    if (err) {
        console.error(err);
        return;
    }

    // Aquí tienes la lista de productos que deseas actualizar
    // Ahora puedes restar la cantidad correspondiente a cada producto
    // y actualizar la base de datos
    productos.forEach(producto => {
        // Encuentra la cantidad a restar de algún lugar (por ejemplo, desde el pedido)
        const cantidadARestar = 10; // Ejemplo, debes establecer la cantidad correcta
        producto.cantidadDisponible -= cantidadARestar;

        // Guarda el producto actualizado en la base de datos
        producto.save(function(err) {
            if (err) {
                console.error(err);
            }
        });
    });
});

// Supongamos que tienes un objeto de pedido en la variable "nuevoPedido"

async function verificarStockPedido(pedido) {
    for (const item of pedido.products) {
      const producto = await Product.findById(item.product);
  
      if (!producto) {
        throw new Error(`Producto no encontrado: ${item.product}`);
      }
  
      if (producto.stock < item.amount) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }
    }
  }
  
// Supongamos que tienes un objeto de pedido en la variable "nuevoPedido"

function verificarStockYGuardarPedido(pedido) {
    verificarStockPedido(nuevoPedido)
      .then(() => {
        // Si pasa la verificación de stock, puedes guardar el pedido en la base de datos
        return nuevoPedido.save();
      })
      .then(() => {
        // También, actualiza el stock de los productos en este punto
      })
      .catch(error => {
        console.error(error.message);
        // Maneja el caso en que no haya suficiente stock
      });
  }
  
  // Luego, puedes llamar a la función
  verificarStockYGuardarPedido(nuevoPedido);
   


  // Supongamos que tienes un objeto de pedido en la variable "nuevoPedido"

// 1. Verificar y restar el stock al realizar un pedido
async function procesarPedido(pedido) {
    for (const item of pedido.products) {
      const producto = await Product.findById(item.product);
  
      if (!producto) {
        throw new Error(`Producto no encontrado: ${item.product}`);
      }
  
      if (producto.stock < item.amount) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }
  
      // Resta la cantidad pedida del stock del producto
      producto.stock -= item.amount;
  
      // Guarda el producto actualizado en la base de datos
      await producto.save();
    }
  
    // Luego, guarda el pedido en la base de datos
    await nuevoPedido.save();
  }
  
  // Llama a la función para procesar el pedido
  procesarPedido(nuevoPedido)
    .then(() => {
      // El pedido se ha procesado con éxito
    })
    .catch(error => {
      console.error(error.message);
      // Maneja el caso en que no haya suficiente stock
    });
  