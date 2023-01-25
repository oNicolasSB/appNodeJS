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
    Categoria.find().sort({date: 'asc'}).lean().then((categorias)=>
    {
        res.render('admin/categorias', {categorias: categorias});
    }).catch((err)=>
    {
        req.flash("error_msg", "Houve um erro ao listar as categorias.");
        res.redirect("/");
    });
});

router.get('/categorias/add', (req, res) => 
{
    res.render('admin/addcategoria');
});

router.post('/categorias/create', (req, res) => 
{
    let erros = [];
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

router.get('/categorias/edit/:id', (req, res) =>
{
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => 
    {
        res.render('admin/editcategoria', {categoria: categoria});
    }).catch((err) =>
    {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect('/admin/categorias');
    });
});

router.post('/categorias/edit', (req, res) =>
{
    let erros = [];
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
        Categoria.findOne({_id: req.body.id}).lean().then((categoria) => 
        {

            res.render('admin/editcategoria', {erros: erros, categoria: categoria});
        }).catch(()=>
        {
            req.flash('error_msg', 'Categoria não encontrada.');
            res.redirect('/admin/categorias');
        });
    } else
    {
        Categoria.findOneAndUpdate({_id: req.body.id},
            {
                nome: req.body.nome,
                slug: req.body.slug
            }, (err, data) => 
            {
                if(err)
                {
                    req.flash('error_msg', 'Erro ao editar categoria.');
                    res.redirect('/admin/categorias');
                } else 
                {
                    req.flash('success_msg', "Categoria editada com sucesso!");
                    res.redirect('/admin/categorias');
                };
            });
        
    };
});

router.get('/categorias/delete/:id', (req, res) =>
{
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) =>
    {
        res.render('admin/deletecategoria', {categoria: categoria});
    }).catch((err) => 
    {
        req.flash('error_msg', 'Categoria não encontrada.');
        res.redirect('/admin/categorias');
    });
});

router.post('/categorias/delete', (req, res) =>
{
    Categoria.deleteOne({_id: req.body.id}).then(()=>
    {
        req.flash('success_msg', 'Categoria deletada com sucesso!');
        res.redirect('/admin/categorias');
    }).catch((err)=>
    {
        req.flash('error_msg', 'Não foi possível excluir a categoria.');
        res.redirect('/admin/categorias');
    });
});

module.exports = router;