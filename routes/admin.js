const express = require('express');
const flash = require('express-flash');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');

router.get('/', (req, res)=>
{
    res.send("Página principal do painel administrativo.");
});

router.get('/posts', (req, res)=> 
{
    res.send("Página de Posts.");
});

router.get('/categorias', (req, res)=>
{
    res.render('admin/categorias');
});

router.get('/categorias/add', (req, res) => 
{
    res.render('admin/addcategoria');
});

router.post('/categorias/nova', (req, res) => 
{
    var erros = [];
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null )
    {
        erros.push({texto: "Nome Inválido."});
    };
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null )
    {
        erros.push({texto: "Slug Inválido."});
    }; 
    if(req.body.nome.length < 3)
    {
        erros.push({texto: "O slug deve ter pelo menos 3 caracteres."});
    }; 
    if(req.body.slug.length < 3)
    {
        erros.push({texto: "O slug deve ter pelo menos 3 caracteres."});
    }; 
    if(erros.length > 0)
    {
        res.render('admin/addcategoria', {erros: erros});
    } else
    {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        };
    
        new Categoria(novaCategoria).save().then(()=> {
            req.flash("success_msg", "Categoria adicionada com sucesso!")
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao adicionar a categoria.");
            res.redirect("/admin/categorias");
        });
    }
});

module.exports = router;