const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Compra = require('../models/Compra'); // Ajusta la ruta si es diferente
const config = require("config");
config.correogmail = "ericklopezod@gmail.com";
config.passwordgmail = "vlmavpzpbgacuvmi";
const nodemailer = require('nodemailer');

exports.landing_page = (req, res) => {
  res.render("index", {
    isAuth: req.session.isAuth,
    username: req.session.username,
    email: req.session.email // Añadido para referencia
  });
};

exports.login_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("login", { err: error });
};

exports.login_post = async (req, res) => {
  if (req.session.isAuth === true) {
    req.session.error = "Ya iniciaste sesión";
    return res.redirect("/index");
  }

  const { email, password } = req.body;
  
  if (!email) {
    req.session.error = "Se necesita el correo";
    return res.redirect("/login");
  }
  
  if (!password) {
    req.session.error = "Se necesita la contraseña";
    return res.redirect("/login");
  }

  const user = await User.findOne({ email });
  
  if (!user) {
    req.session.error = "Credenciales inválidas";
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    req.session.error = "Credenciales inválidas";
    return res.redirect("/login");
  }

  req.session.isAuth = true;
  req.session.username = user.username;
  req.session.email = user.email; // ¡CRUCIAL! Añadir el email a la sesión
  console.log(`Sesión iniciada para: ${user.email}`);
  res.redirect("/index");
};

exports.register_get = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("register", { err: error });
};

exports.register_post = async (req, res) => {
  const { username, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    req.session.error = "El usuario ya existe";
    return res.redirect("/register");
  }

  const hashedPsw = await bcrypt.hash(password, 12);
  user = new User({ username, email, password: hashedPsw });
  await user.save();
  res.redirect("/login");
};

exports.dashboard_get = (req, res) => {
  const username = req.session.username;
  res.render("dashboard", { name: username });
};

exports.logout_post = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/index");
  });
};

exports.compra_post = async (req, res) => {
  try {
    // Verificar autenticación primero
    if (!req.session.isAuth || !req.session.email) {
      console.log("Usuario no autenticado - Redirigiendo a login");
      return res.redirect('/login');
    }

    // Verificar datos del carrito
    if (!req.body.carrito || !req.body.grantotal) {
      throw new Error("Datos de compra incompletos");
    }

    const productos = JSON.parse(req.body.carrito);
    const grantotal = parseFloat(req.body.grantotal);

    // Validar estructura del carrito
    if (!Array.isArray(productos)) {
      throw new Error("Formato de carrito inválido");
    }

    // Crear y guardar la compra
    const nuevaCompra = new Compra({
      email: req.session.email,
      productos: productos.map(item => ({
        titulo: item.titulo,
        precio: item.precio,
        cantidad: item.cantidad
      })),
      grantotal: grantotal
    });

    await nuevaCompra.save();
    
    // Configurar correo electrónico
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.correogmail,
        pass: config.passwordgmail
      }
    });

    // Opciones del correo (usando req.session.email en lugar de post.email)
    const mailOptions = {
      from: config.correogmail,
      to: req.session.email, // Corregido: usar email de la sesión
      subject: "Su compra fue realizada con éxito",
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;background-color: antiquewhite;margin:0;padding: 42px;">
          <div style="max-width: 600px; margin: 0 auto;padding: 20px; background-color: #ffff;border-radius: 5px; box-shadow: 0 0 10;">
              <h1 style="font-size: 24px; color: #333333; margin-bottom: 20px;">Confirmación de compra</h1>
              <p>Hola,</p>
              <p>Gracias por tu compra. Aquí están los detalles:</p>
              <ul>
                ${productos.map(item => `
                  <li>${item.titulo} - Cantidad: ${item.cantidad} - $${item.precio.toFixed(2)}</li>
                `).join('')}
              </ul>
              <p><strong>Total: $${grantotal.toFixed(2)}</strong></p>
              <p>Para ver tu ticket de compra, haz clic en el siguiente enlace:</p>
              <p><a style="display: inline-block; padding: 10px 20px; background-color: #337ab7; color:#fff; text-decoration: none; border-radius:3px;" 
                 href="http://localhost:3000/ticket/${nuevaCompra._id}">Ver ticket de compra</a></p>
          </div></div>`
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);
    
 // Limpiar carrito del localStorage
    if (req.session.cart) {
      delete req.session.cart;
    }

    console.log("Compra registrada exitosamente");
    res.redirect(`/ticket/${nuevaCompra._id}`);
;
  

  } catch (err) {
    console.error("Error al procesar compra:", err.message);
  }
};

exports.ticket_get = async (req, res) => {
  try {
    if (!req.session.isAuth || !req.session.email) {
      return res.redirect("/login");
    }

    const compra = await Compra.findById(req.params.id);
    if (!compra) {
      return res.status(404).send("Compra no encontrada");
    }

    res.render("ticket", {
      username: req.session.username,
      compra
    });
  } catch (err) {
    console.error("Error al mostrar ticket:", err.message);
    res.status(500).send("Error al cargar el ticket");
  }
};

exports.user_data_post = async (req,res) =>{
  try{
    if (!req.session.isAuth || !req.session.email) {
      console.log("No tienes cuenta iniciada");
      return res.redirect('/login');
    }
    const correo = JSON.parse(req.body.email);
    const produstos = JSON.parse(req.body.productos);
    console.log(correo);
  }catch(err){
    req.session.error = `Error en el try ${err.message}`;
  }

};

exports.mis_compras_get = async (req, res) => {
  try {
    //si no hay sesion no lo deja entonces va al login
    if (!req.session.isAuth || !req.session.email) {
      return res.redirect('/login');
    }
    //no puedo asignarle otro valor despues pero su contenido si
    //await=esperar una promesa se resuelva antes de seguir no puede seguir sin una respuesta del servidor
    const compras = await Compra.find({ email: req.session.email }).sort({ fecha: -1 });
    //.find budca los documentos en la base 
    //acepta un obejto con filtros osea email
    //Devuélveme todos los registros de la colección compras donde el campo email sea igual al email del usuario actual (guardado en la sesión)”.

    res.render('compras', { //renderizo mi vista ejs
      //res=respuesta del servidor
      username: req.session.username,
      compras
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener las compras");
  }
};


