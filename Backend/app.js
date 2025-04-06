// app.js
var express = require('express');
global.app = express();

const cors = require('cors');
app.use(cors());

var bodyParse = require('body-parser');
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

const config = require(__dirname + '/config.js').config;
const mongoose = require('mongoose');

var session = require('express-session')({
  secret: config.claveoculta,
  resave: true,
  saveUninitialized: true,
  cookie: { path: '/', httpOnly: true, maxAge: config.tiemposesion },
  name: "Tienda",
  rolling: true
});
app.use(session);

// Importar rutas
require(__dirname + '/routes.js');

// Conectar a Mongo
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://0.0.0.0:27017/' + config.bfMongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (error, respuesta) => {
  if (error) {
    console.log(error);
  } else {
    console.log("✅ BD Conectada");
  }
});

// Levantar servidor
app.listen(config.puerto, function () {
  console.log('🚀 Servidor funcionando en puerto ' + config.puerto);
});
