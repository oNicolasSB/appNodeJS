const express = require('express');
const flash = require('express-flash');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');
require('../models/Postagem');
const Postagem = mongoose.model('postagens');

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

router.get('/categorias/create', (req, res) => 
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
        erros.push({texto: "O nome deve ter pelo menos 3 caracteres."});
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
    Categoria.findOne({_id: req.params.id}).lean().then((categorias) => 
    {
        res.render('admin/editcategoria', {categorias: categorias});
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
        erros.push({texto: "O nome deve ter pelo menos 3 caracteres."});
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

router.get('/postagens', (req, res) =>
{
    Postagem.find().populate('categoria').sort({date: 'asc'}).lean().then((postagens) =>
    {
        res.render('admin/postagens', {postagens: postagens});
    }).catch((err) =>
    {
        req.flash('error_msg', "Houve um erro ao carregar as postagens");
        res.redirect('/');
    })
});

router.get('/postagens/create', (req, res) =>
{
    Categoria.find().lean().then((categorias) =>
    {
        res.render('admin/addpostagem', {categorias: categorias});
    }).catch((err) =>
    {
        req.flash('error_msg', "Houve um erro ao carregar as categorias.");
        res.redirect('admin/postagens');
    });
});

router.post('/postagens/create', (req, res) =>
{
    let erros = [];
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null )
    {
        erros.push({texto: "Título Inválido."});
    };
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null )
    {
        erros.push({texto: "Slug Inválido."});
    }; 
    if(req.body.titulo.length < 3)
    {
        erros.push({texto: "O título deve ter pelo menos 3 caracteres."});
    }; 
    if(req.body.slug.length < 3)
    {
        erros.push({texto: "O slug deve ter pelo menos 3 caracteres."});
    }; 
    if(req.body.categoria == 0)
    {
        erros.push({texto: "Nenhuma categoria selecionada."});
    };
    Categoria.findOne({_id: req.body.categoria}).lean().catch((err) =>
    {
        erros.push({texto: "Categoria inexistente."});
    });

    if(erros.length > 0)
    {
        res.render('admin/addpostagem', {erros: erros});
    } else
    {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        };
    
        new Postagem(novaPostagem).save().then(()=> {
            req.flash("success_msg", "Postagem adicionada com sucesso!")
            res.redirect('/admin/postagens');
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao adicionar a postagem.");
            res.redirect("/admin/postagens");
        });
    }
});

router.get('/postagens/edit/:id', (req, res) =>
{
    
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => 
    {
        Categoria.findOne({_id: postagem.categoria._id}).lean().then((categoriaAtual) =>
        {
            Categoria.find({_id: {$ne: postagem.categoria._id}}).lean().then((categorias) => 
            {
                res.render('admin/editpostagem', {categorias: categorias, postagem: postagem, categoriaAtual: categoriaAtual});
            }).catch((err) => 
            {
                req.flash('error_msg', "Houve um erro ao listar as categorias.");
                res.redirect('/admin/postagens');
            });
        }).catch((err) => 
        {
            req.flash('error_msg', "Falha ao encrontrar a categoria atual");
            res.redirect('/admin/postagens');
        });

    }).catch((err) => 
    {
        req.flash('error_msg', "Houve um erro ao carregar o formulário de edição.");
        res.redirect('/admin/postagens');
    });
});

router.post('postagens/edit', (req, res) =>
{
    let erros = [];
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null )
    {
        erros.push({texto: "Nome Inválido."});
    };
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null )
    {
        erros.push({texto: "Slug Inválido."});
    }; 
    if(req.body.titulo.length < 3)
    {
        erros.push({texto: "O título deve ter pelo menos 3 caracteres."});
    }; 
    if(req.body.slug.length < 3)
    {
        erros.push({texto: "O slug deve ter pelo menos 3 caracteres."});
    }; 
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null )
    {
        erros.push({texto: "Descriçãop Inválida."});
    }; 
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null )
    {
        erros.push({texto: "Conteúdo Inválido."});
    }; 
    if(req.body.descricao.length < 3)
    {
        erros.push({texto: "A descrição deve ter pelo menos 3 caracteres."});
    }; 
    if(req.body.conteudo.length < 3)
    {
        erros.push({texto: "O conteudo deve ter pelo menos 3 caracteres."});
    }; 
    Categoria.findOne({_id: req.body.categoria}).lean().then((categoria) => 
    {}).catch((err) => 
    {
        erros.push({texto: "Categoria não encontrada."});
    });

    if(erros.length > 0)
    {
        Postagem.findOne({_id: req.body.id}).lean().then((postagem) => 
        {
            res.render('admin/editpostagem', {erros: erros, postagem: postagem});
        }).catch(()=>
        {
            req.flash('error_msg', 'Postagem não encontrada.');
            res.redirect('/admin/postagens');
        });
    } else
    {
        Postagem.findOneAndUpdate({_id: req.body.id},
            {
                titulo: req.body.titulo,
                slug: req.body.slug,
                categoria: req.body.categoria,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo
            }, (err, data) => 
            {
                if(err)
                {
                    req.flash('error_msg', 'Erro ao editar postagem.');
                    res.redirect('/admin/postagens');
                } else 
                {
                    req.flash('success_msg', "Postagem editada com sucesso!");
                    res.redirect('/admin/postagens');
                };
            });
        
    };
});

router.get('/postagens/delete/:id', (req, res) =>
{
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) =>
    {
        res.render('admin/deletepostagem', {postagem: postagem});
    }).catch((err) => 
    {
        req.flash('error_msg', 'Postagem não encontrada.');
        res.redirect('/admin/postagens');
    });
});

router.post('/postagens/delete', (req, res) =>
{
    Postagem.deleteOne({_id: req.body.id}).then(()=>
    {
        req.flash('success_msg', 'Postagem deletada com sucesso!');
        res.redirect('/admin/postagens');
    }).catch((err)=>
    {
        req.flash('error_msg', 'Não foi possível excluir a postagem.');
        res.redirect('/admin/postagens');
    });
});

module.exports = router;