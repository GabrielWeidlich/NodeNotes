const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Users')
const Users = mongoose.model('Users')
const bcrypt = require('bcryptjs')
const passport = require('passport')
require('../config/auth')

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/register',(req,res)=>{
    let errors = []
    if(!req.body.username || typeof req.body.username == undefined || req.body.username == null){
        errors.push({text: 'Invalid username.'})}
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({text: 'Invalid email.'})}
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        errors.push({text: 'Invalid password.'})}
    if(!req.body.passwordConfirmation || typeof req.body.passwordConfirmation == undefined || req.body.passwordConfirmation == null){
        errors.push({text: 'Passwords do not match.'})}
    if(req.body.password != req.body.passwordConfirmation){
        errors.push({text: 'Passwords do not match.'})}
    if(req.body.password.length < 4){
        errors.push({text: 'Password must be at least 4 characters long.'})
    }
    if(errors.length > 0){
        res.render('users/register', {errors: errors})
    }else{
        Users.findOne({email:req.body.email}).then((userEmail)=>{
            if(userEmail){
                req.flash('error_msg','Already registered user.')
                res.redirect('/users/register')
            }else{
                const newUser = new Users({
                    username:req.body.username,
                    email:req.body.email,
                    password: req.body.password,
                })


                bcrypt.genSalt(10, (error, salt)=>{
                    bcrypt.hash(newUser.password, salt, (error, hash)=>{
                        if(error){
                            req.flash('error_msg','Failed to create user')
                            res.redirect('/users/register')
                        }else{
                            newUser.password = hash
                            newUser.save().then(()=>{
                                req.flash('success_msg','Account created successfully!')
                                res.redirect('/home')
                            }).catch((error)=>{
                                req.flash('error_msg','An error has been ocurred'+ error)
                                res.redirect('/home')
                            })
                        }
                    })
                })
        
                
            }     
        }).catch((error)=>{
            req.flash('error_msg','An error has been ocurred '+ error)
            res.redirect('/home')
        })
    }
})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)
})

module.exports = router
