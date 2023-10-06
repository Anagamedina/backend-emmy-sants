// const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe("sk_test_51NworTIamvwN9XVUBzNti2WhGDvdoagrQ3RDOxcsTpO2C7M8efP7Y18pkAsuY7iBpg1v9aZp2WOrTOml0N5qFcK500USulMfhg");
const Orders = require('../models/Orders.model');
const router = require("express").Router();


//Código para verificar el estado de pago y actualizar el estado del pedido
router.get("/checkPayment/:orderID", async (req, res) => {
  let id = req.params.orderID 
  let order = await Orders.findById(id) 
  const strapiId =  order.strapiID
  // let strapiId = "cs_test_a1XBYNBk0DjkQnEGbh0iNdyrvqtX7n4GaTN5iZ35R6AQTucvUAaeNmjzZc"
  try {
    const paymentIntent = await stripe.checkout.sessions.retrieve(
      strapiId
    )

    //update order status
    if(paymentIntent.payment_status === "paid"){
      await Orders.findByIdAndUpdate(id, {state:"Pagado"}) 
    }
    // Establece una propiedad en res.locals con el ID del pedido actualizado
      res.locals.updatedOrderId = id;
    // res.send({payment_status: paymentIntent.payment_status}); // paid or unpaid
      res.send({status: "ok"});  
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
