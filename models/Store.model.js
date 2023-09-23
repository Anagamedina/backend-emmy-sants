const { Schema, model } = require("mongoose");


const StorageSchema = new Schema(
    {
        products: [
          {
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            amount: Number
          }
        ],
        state: {
          type: String,
          enum: Object.values(OrderStatus), // Asegura que solo sea un estado de pedido válido
        },
      },
      {
        timestamps: true,
      }
    );
const Storage = model("Store", StorageSchema);

module.exports = Storage;

