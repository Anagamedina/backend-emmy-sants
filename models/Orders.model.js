const { Schema, model } = require("mongoose");


const OrdersSchema = new Schema(
  {
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Producto' },
        amount: Number
      }],
      usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
      state: String,
    
      });

const Orders = model("Orders", OrdersSchema);

module.exports = Orders;

