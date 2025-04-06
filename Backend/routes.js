// routes.js
const Producto = require('./modeloProducto');

app.post('/Guardar', async function (request, response) {
  try {
    console.log("➡️ Recibido en /Guardar:", request.body);
    const productos = request.body.productos;

    if (!Array.isArray(productos)) {
      return response.status(400).send("Se espera un array de productos.");
    }

    await Producto.insertMany(productos);
    response.send("Productos guardados correctamente.");
  } catch (err) {
    console.error("❌ Error al guardar:", err);
    response.status(500).send("Error al guardar productos.");
  }
});

app.post('/CargarTodas', async function (request, response) {
  try {
    const productos = await Producto.find();
    response.json(productos);
  } catch (err) {
    console.error(err);
    response.status(500).send("Error al cargar productos.");
  }
});

app.post('/Actualizar', async function (request, response) {
  try {
    const { id, nombre, precio } = request.body;
    await Producto.findByIdAndUpdate(id, { nombre, precio });
    response.send("Producto actualizado.");
  } catch (err) {
    console.error(err);
    response.status(500).send("Error al actualizar.");
  }
});

app.post('/Eliminar', async function (request, response) {
  try {
    const { id } = request.body;
    await Producto.findByIdAndDelete(id);
    response.send("Producto eliminado.");
  } catch (err) {
    console.error(err);
    response.status(500).send("Error al eliminar.");
  }
});
