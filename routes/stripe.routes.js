// const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe(
  "sk_test_51NworTIamvwN9XVUBzNti2WhGDvdoagrQ3RDOxcsTpO2C7M8efP7Y18pkAsuY7iBpg1v9aZp2WOrTOml0N5qFcK500USulMfhg"
);

const Orders = require('../models/Orders.model');

const router = require("express").Router();

//not used
router.get("/checkout", async (req, res) => {
  let id = "q2343";
  let amount = 22.22;
  let storeName = "Floristeria-emmy-sants";
  let currency = "EUR";
  let domainNameFront = "http://localhost:3000";
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Pedido de " + storeName,
            },
            unit_amount: (amount * 100).toFixed(0),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: domainNameFront + "/success/order?id=" + id,
      cancel_url: domainNameFront + "/categories?canceled=true",
    });
    res.send(session);
  } catch (error) {
    console.log(error);
  }
});


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
 
    // res.send({payment_status: paymentIntent.payment_status}); // paid or unpaid
      res.send({status: "ok"});  
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
