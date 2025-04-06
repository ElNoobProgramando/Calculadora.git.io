// modeloProducto.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number
});

module.exports = mongoose.model('Producto', productoSchema);
