const { Schema, model } = require("mongoose");
const OrderStatus = require("../utils/orderStatus");

const OrdersSchema = new Schema(
  {
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Producto' },
        amount: Number
      }
    ],
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    state: {
      type: String,
      enum: Object.values(OrderStatus), // Asegura que solo sea un estado de pedido válido
    },
  },
  {
    timestamps: true,
  }
);

const Orders = model("Orders", OrdersSchema);

module.exports = Orders;
