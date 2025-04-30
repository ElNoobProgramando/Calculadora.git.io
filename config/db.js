const config = require("config");
const db = config.get("mongoURI");
const mongoose = require("mongoose");
config.correogmail = "ericklopezod@gmail.com";
config.passwordgmail = "vlmavpzpbgacuvmi";

const connectDB = async () => {
  try {
    await mongoose.connect(db); // opciones modernas, sin parámetros

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Something went wrong with Database connection");
    console.error(error.message); // <--- Esto ayuda a depurar
    process.exit(1);
  }
};

module.exports = connectDB;
