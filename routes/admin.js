//Carregamento dos módulos
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categories')
const Category = mongoose.model('Categories')
require('../models/Posts')
const Posts = mongoose.model('Posts')

router.get('/categories',(req,res)=>{
    Category.find().lean().then((categories)=>{
        res.render('admin/categories',{categories:categories})
    }).catch((error)=>{
        req.flash('error_msg','An error has been ocurred '+ error)
    })
})

router.get('/categories/add', (req,res)=>{
    res.render('admin/addcategory')
})

router.get('/categories/edit/:id',(req,res)=>{
    Category.findOne({_id:req.params.id}).then((category)=>{
        res.render('admin/editcategory', {title:category.title, slug:category.slug, _id:category.id})
    }).catch((error)=>{
        req.flash('error_msg','An error has been ocurred '+error)
        res.redirect('/admin/categories')
    })
})

router.post('/categories/delete',(req,res)=>{
    Category.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg','Category deleted successfully')
        res.redirect('/admin/categories')
    }).catch((error)=>{
        req.flash('error_msg','An error has been ocurred '+ error)
        res.redirect('/admin/categories')
    })
})

router.get('/posts',(req,res)=>{
    Posts.find().lean().populate('category').sort({date:'desc'}).then((posts)=>{
        res.render('admin/posts',{posts: posts})
    }).catch((error)=>{
        req.flash('error_msg','An error has been ocurred '+error)
    })
    
})

router.get('/posts/add',(req,res)=>{
    Category.find().lean().then((categories)=>{
        res.render('admin/addposts',{categories:categories})
    }).catch((error)=>{
        req.flash('error_msg','An error has been ocurred '+error)
        res.render('admin/addposts')
    })
})

router.post('/posts/new',(req,res)=>{
    let errors = []
    if(!req.body.title || req.body.title == undefined || req.body.title == null){
        errors.push({text: 'Invalid title.'})
    }
    if(!req.body.slug || req.body.slug == undefined || req.body.slug == null){
        errors.push({text: 'Invalid slug.'})
    }
    if(!req.body.description || req.body.description == undefined || req.body.description == null){
        errors.push({text: 'Invalid description.'})
    }
    if(req.body.title < 2 || req.body.slug < 2 || req.body.content < 2 || req.body.description < 2 ){
        errors.push({text: 'Not enough characters'})
    }
    if(req.body.category == 0){
        errors.push({text: 'Invalid category.'})
    }
    if(errors.length > 0){
        res.render('admin/addposts',{errors: errors})
    }else{
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category
        }

        new Posts(newPost).save().then(()=>{
            req.flash('success_msg','The post creation was successful.')
            res.redirect('/admin/posts')
        }).catch((error)=>{
            req.flash('error_msg','Failed to create post '+ error)
            res.redirect('admin/posts')
        })
    }
})

router.post('/categories/edit',(req,res)=>{
    let errors = []
    if(!req.body.title || req.body.title == undefined || req.body.title == null){
        errors.push({text: 'Invalid title.'})
    }
    if(!req.body.slug || req.body.slug == undefined || req.body.slug == null){
        errors.push({text: 'Invalid slug.'})
    }
    if(req.body.title < 2 || req.body.slug < 2){
        errors.push({text: 'Not enough characters.'})
    }else{
        Category.findOne({_id:req.body.id}).then((category)=>{
            if (!category) {
                req.flash('error_msg', 'Category not found');
                return res.redirect('/admin/categories');
            }

            category.title = req.body.title
            category.slug = req.body.slug
    
            category.save().then(()=>{
                req.flash('success_msg','Category edited successfully')
                res.redirect('/admin/categories')
            }).catch((error)=>{
                req.flash('error_msg','An error has been ocurred '+error)
                res.redirect('/admin/categories')
            })
        }).catch((error)=>{
            req.flash('error_msg','An error has been ocurred '+error)
            res.redirect('/admin/categories')
        })
    }


   
})

router.post('/categories/new',(req,res)=>{
    let errors = []
    if(!req.body.title ||  typeof req.body.title == undefined || req.body.title == null){
        errors.push({text: 'Invalid title.'})}
    if(!req.body.slug ||  typeof req.body.slug == undefined || req.body.slug == null){
        errors.push({text: 'Invalid slug.'})}
    if(req.body.title < 2 || req.body.slug < 2){
        errors.push({text: 'Not enough characters.'})}    
    if(errors.length > 0){
        res.render('admin/Addcategory',{errors: errors}) //pass to views
    }else{
        const NewCategory = {
            title: req.body.title,
            slug: req.body.slug
        }

        new Category(NewCategory).save().then(()=>{
            req.flash('success_msg','The category creation was successful.')
            res.redirect('/admin/categories')
        }).catch((error)=>{
            req.flash('error_msg','An error has ocurred '+ error)
            res.redirect('/admin/categories/add')
        })
    } 
})

module.exports = router