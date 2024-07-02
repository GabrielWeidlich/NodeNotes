const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Users model
    require('../models/Users')
    const Users = mongoose.model('Users')

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email',passwordField: 'password'},(email, password, done)=>{
        Users.findOne({email: email}).then((user)=>{
            if(!user){
                return done(null, false, {message: "This account do not exist."})
            }else{
                //compare password
                bcrypt.compare(password, user.password, (error, equals)=>{
                    if(equals){
                        return done(null, user)
                    }else{
                        return done(null, false, {message: 'Wrong password.'})
                    }
                })
            }
        })
    }))

    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })

    passport.deserializeUser((id, done)=>{
        Users.findById(id).then((user)=>{
            if(user){
                return done(null, false)
            }
            done(null, user)
        }).catch((error)=>{
            done(error, null)
        })
    })
}