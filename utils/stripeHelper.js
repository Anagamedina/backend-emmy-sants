const Stripe = require("stripe");
// Crear una instancia de Stripe con tu clave secreta
const stripe = new Stripe("sk_test_51NworTIamvwN9XVUBzNti2WhGDvdoagrQ3RDOxcsTpO2C7M8efP7Y18pkAsuY7iBpg1v9aZp2WOrTOml0N5qFcK500USulMfhg");

// Función asincrónica para crear una sesión de Stripe
async function createStripeSession(id, amount, storeName ="floristeria-emmy-sants", currency = "EUR", domainNameFront = process.env.ORIGIN || "http://localhost:3000") {
  try {
    // Crear una sesión de Stripe 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Pedido de " + storeName,  
            },
            unit_amount: (amount * 100).toFixed(0), // Monto del producto en centavos
          },
          quantity: 1, // Cantidad de este producto en la sesión
        },
      ],
      mode: "payment", 
      success_url: `${domainNameFront}/success?id=${id}`, // URL de éxito después del pago
      cancel_url: `${domainNameFront}/`, // URL en caso de cancelación del pago
    });

    return session; // Devuelve la sesión creada
  } catch (error) {
    console.log(error); // Registra cualquier error en la consola
    throw error; // Puedes lanzar una excepción si ocurre un error para que sea manejado en otro lugar
  }
}


module.exports = { createStripeSession };

