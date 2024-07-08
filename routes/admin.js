//Carregamento dos módulos
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categories')
const Category = mongoose.model('Categories')
require('../models/Posts')
const Posts = mongoose.model('Posts')
const { eAdmin } = require('../helpers/eAdmin')

router.get('/categories', eAdmin, (req, res) => {
    Category.find().lean().then((categories) => {
        res.render('admin/categories', { categories: categories })
    }).catch((error) => {
        req.flash('error_msg', 'An error has been ocurred ' + error)
    })
})

router.get('/categories/add', eAdmin, (req, res) => {
    res.render('admin/addcategory')
})

router.get('/categories/edit/:id', eAdmin, (req, res) => {
    Category.findOne({ _id: req.params.id }).then((category) => {
        res.render('admin/editcategory', {
            title: category.title,
            slug: category.slug,
            _id: category.id
        })
    }).catch((error) => {
        req.flash('error_msg', 'An error has been ocurred ' + error)
        res.redirect('/admin/categories')
    })
})

router.post('/categories/delete', eAdmin, (req, res) => {
    Category.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('success_msg', 'Category deleted successfully')
        res.redirect('/admin/categories')
    }).catch((error) => {
        req.flash('error_msg', 'An error has been ocurred ' + error)
        res.redirect('/admin/categories')
    })
})

router.get('/posts', eAdmin, (req, res) => {
    Posts.find().lean().populate('category').sort({ date: 'desc' }).then((posts) => {
        res.render('admin/posts', { posts: posts })
    }).catch((error) => {
        req.flash('error_msg', 'An error has been ocurred ' + error)
    })

})

router.get('/posts/add', eAdmin, (req, res) => {
    Category.find().lean().then((categories) => {
        res.render('admin/addposts', { categories: categories })
    }).catch((error) => {
        req.flash('error_msg', 'An error has been ocurred ' + error)
        res.render('admin/addposts')
    })
})

router.get('/posts/edit/:id', eAdmin, (req, res) => {
    Posts.findOne({ _id: req.params.id }).then((posts) => {
        res.render('admin/editposts', {
            title: posts.title,
            slug: posts.slug,
            content: posts.content,
            description: posts.description,
            _id: posts.id
        })
    }).catch((error) => {
        req.flash('error_msg', 'An error has been ocurred: ' + error)
        res.redirect('/admin/posts')
    })
})

router.post('/posts/edit', eAdmin, (req, res) => {
    let errors = []
    if (!req.body.title || req.body.title == undefined || req.body.title == null) {
        errors.push({ text: "The new title is invalid." })
    }
    if (!req.body.slug || req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: "The new slug is invalid." })
    }
    if (!req.body.description || req.body.description == undefined || req.body.description == null) {
        errors.push({ text: "The new description is invalid." })
    }
    if (!req.body.content || req.body.content == undefined || req.body.content == null) {
        errors.push({ text: "The new content is invalid." })
    }
    if (req.body.title < 2 || req.body.slug < 2 || req.body.description < 2 || req.body.content < 2) {
        errors.push({ text: 'Not enough characters' })
    }
    if (errors.length > 0) {
        req.flash('error_msg', errors.map(err => err.text))
        res.redirect(`/admin/posts`)
    } else {
        Posts.findOne({ _id: req.body.id }).then((post) => {

            post.title = req.body.title,
                post.slug = req.body.slug,
                post.description = req.body.description,
                post.content = req.body.content

            post.save().then(() => {
                req.flash('success_msg', 'Post edited successfully.')
                res.redirect('/admin/posts')
            }).catch((error) => {
                req.flash('error_msg', 'An error has been ocurred ' + error)
            })
        }).catch((error) => {
            req.flash('error_msg', 'An error has been ocurred' + error)
            res.redirect('/admin/posts')
        })

    }
})

router.post('/posts/delete', eAdmin, (req, res) => {
    Posts.deleteOne({ _id: req.body.id }).then(() => {
        req.flash('success_msg', 'Post deleted successfully.')
        res.redirect('/admin/posts')
    }).catch((error) => {
        req.flash('error_msg', 'An error has been ocurred ' + error)
        res.redirect('/admin/posts')
    })
})

router.post('/posts/new', eAdmin, (req, res) => {
    let errors = []
    if (!req.body.title || req.body.title == undefined || req.body.title == null) {
        errors.push({ text: 'Invalid title.' })
    }
    if (!req.body.slug || req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: 'Invalid slug.' })
    }
    if (!req.body.description || req.body.description == undefined || req.body.description == null) {
        errors.push({ text: 'Invalid description.' })
    }
    if (req.body.title < 2 || req.body.slug < 2 || req.body.content < 2 || req.body.description < 2) {
        errors.push({ text: 'Not enough characters' })
    }
    if (req.body.category == 0) {
        errors.push({ text: 'Invalid category.' })
    }
    if (errors.length > 0) {
        res.render('admin/addposts', { errors: errors })
    } else {
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category
        }

        new Posts(newPost).save().then(() => {
            req.flash('success_msg', 'The post creation was successful.')
            res.redirect('/admin/posts')
        }).catch((error) => {
            req.flash('error_msg', 'Failed to create post ' + error)
            res.redirect('/admin/posts')
        })
    }
})

router.post('/categories/edit', eAdmin, (req, res) => {
    let errors = []
    if (!req.body.title || req.body.title == undefined || req.body.title == null) {
        errors.push({ text: 'Invalid title.' })
    }
    if (!req.body.slug || req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: 'Invalid slug.' })
    }
    if (req.body.title < 2 || req.body.slug < 2) {
        errors.push({ text: 'Not enough characters.' })
    }
    if (errors.length > 0) {
        req.flash('error_msg',errors.map(err => err.text))
        res.redirect('/admin/categories')
    } else {
        Category.findOne({ _id: req.body.id }).then((category) => {
            if (!category) {
                req.flash('error_msg', 'Category not found');
                return res.redirect('/admin/categories');
            }

            category.title = req.body.title
            category.slug = req.body.slug

            category.save().then(() => {
                req.flash('success_msg', 'Category edited successfully')
                res.redirect('/admin/categories')
            }).catch((error) => {
                req.flash('error_msg', 'An error has been ocurred ' + error)
                res.redirect('/admin/categories')
            })
        }).catch((error) => {
            req.flash('error_msg', 'An error has been ocurred ' + error)
            res.redirect('/admin/categories')
        })
    }



})

router.post('/categories/new', eAdmin, (req, res) => {
    let errors = []
    if (!req.body.title || typeof req.body.title == undefined || req.body.title == null) {
        errors.push({ text: 'Invalid title.' })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ text: 'Invalid slug.' })
    }
    if (req.body.title < 2 || req.body.slug < 2) {
        errors.push({ text: 'Not enough characters.' })
    }
    if (errors.length > 0) {
        res.render('admin/Addcategory', { errors: errors }) //pass to views
    } else {
        const NewCategory = {
            title: req.body.title,
            slug: req.body.slug
        }

        new Category(NewCategory).save().then(() => {
            req.flash('success_msg', 'The category creation was successful.')
            res.redirect('/admin/categories')
        }).catch((error) => {
            req.flash('error_msg', 'An error has ocurred ' + error)
            res.redirect('/admin/categories/add')
        })
    }
})

module.exports = router