const { Schema, model } = require("mongoose");


const StorageSchema = new Schema(
      { 
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        amount: Number
      },
      {
        timestamps: true,
      }
    );
const Storage = model("Storage", StorageSchema);

module.exports = Storage;

