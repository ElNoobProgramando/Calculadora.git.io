const express = require ("express");
const bcrypt = require('bcryptjs')
const session = require ('express-session');
const MongoDBSession=require('connect-mongodb-session')(session);
const mongoose = require ("mongoose");
var config = {};
config.bfMongo = "Ecomerce";

const app = express();


const UserModel = require("./modules/User");
const User = require("./modules/User");




app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));


app.use(session({
    secret:'key',
    resave:false,
    saveUninitialized:false,
    store:store,

}))

const isAuth = (req,res,next) =>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/login')
    }
}



app.get ("/", (req,res)=>{
    res.render("landing");
});


app.get ("/login", (req,res)=>{
    res.render("login");
});

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const user = await UserModel.findOne({email});
    if(!user){
        return res.redirect('/login');

    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.redirect("/login");
    }

    req.session.isAuth = true;
    res.redirect('/dashboard');
});

app.get ("/register", (req,res)=>{
    res.render("register");
});


app.post ("/register", async (req,res)=>{
    const {username,email,password} = req.body;
    let user = await UserModel.findOne({email});
     
    if(user){
        return res.redirect('/register');
    }
    const hashedPsw = await bcrypt.hash(password,12);
    user = new UserModel({
        username,
        email,
        password:hashedPsw
    });
    await user.save();
    res.redirect("/login")

});



app.get ("/dashboard", isAuth,(req,res)=>{
    res.render("dashboard");
});


app.get("/", (req,res) =>{
    req.session.isAuth = true;
    res.send("Hellos");

});

app.post('/logout', (req, res) =>{
    req.session.destroy((err) =>{
        if(err) throw err;
        res.redirect("/login");
    });
})

app.post('comprar', async (req,res)=>{
    const {titulo,precio,cantidad,grantotal,email} = req.body;
    const user = await UserModel.findOne({email});
    if(!user){
        return res.redirect('/login');
    }
    const hashedPsw = await bcrypt.hash(password,12);
    user = new UserModel({
        titulo,
        precio,
        cantidad,
        grantotal,
        email
    });
    await user.save();
   
});


app.get('/user', async (req,res) =>{
    console.log(req.session.email);
});



app.listen(3000, console.log("server runing on "));
