//Carregamento dos módulos
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categories')
const Category = mongoose.model('Categories')

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
        res.render('admin/AddCategory',{errors: errors}) //pass to views
    }else{
        const NewCategory = {
            title: req.body.title,
            slug: req.body.slug
        }

        new Category(NewCategory).save().then(()=>{
            req.flash('success_msg','The creation was successful')
            res.redirect('/admin/categories')
        }).catch((error)=>{
            req.flash('error_msg','An error has ocurred '+ error)
            res.redirect('/admin/categories/add')
        })
    } 
})

module.exports = router