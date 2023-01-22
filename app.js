//carregando módulos
const express = require('express');
const handlebars = require('express-handlebars');
//const mongoose = require('mongoose');
const app = express();
const admin = require('./routes/admin');
const home = require('./routes/home');
const path = require('path');

//configurações
//tratamento de dados do cliente
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//template engine com handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: '_Layout'}));
app.set('view engine', 'handlebars');
//banco de dados com mongoose
    //em breve
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