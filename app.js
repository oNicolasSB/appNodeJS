//carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();
const admin = require('./routes/admin');
const home = require('./routes/home');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');

//configurações
//session
app.use(session(
    {
        secret: "blognodejs",
        resave: true,
        saveUninitialized: true
    }
));
app.use(flash());
//middleware
app.use((req, res, next) => 
{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
//tratamento de dados do cliente
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//template engine com handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: '_layout'}));
app.set('view engine', 'handlebars');
//banco de dados com mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blognodejs", {useNewUrlParser: true}).then(()=>
{
    console.log("MongoDB conectado com sucesso.");
}).catch((err)=>
{
    console.log("Houve um erro na conexão: " + err);
});
//arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));


//rotas
app.use('/', home);
app.use('/admin', admin);


//Iniciando servidor
const Port = 8081;
app.listen(Port, ()=>
{
    console.log("Servidor rodando em http://localhost:"+ Port);
})