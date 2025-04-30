const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const productoSchema = new Schema({
  titulo: { type: String, required: true },
  precio: { type: Number, required: true },
  cantidad: { type: Number, required: true }
});

const compraSchema = new Schema({
  email: { type: String, required: true },
  productos: [productoSchema],
  grantotal: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Compra", compraSchema);
