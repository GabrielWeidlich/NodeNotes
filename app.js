const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const path = require('path')
const admin = require('./routes/admin')
const bodyParser = require('body-parser')
const { default: mongoose } = require('mongoose')
const Categories = mongoose.model('Categories')
const db = require('./config/db')
const session = require('express-session')
const flash = require('connect-flash')
const users = require('./routes/user')
const passport = require('passport')
require('./config/auth')(passport)  


//Configs
    //Session
        app.use(session({
            secret: 'nodenotes',
            resave: true,
            saveUninitialized: true
        }))

        //Passport
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    //Handlebars
        app.engine('handlebars',handlebars.engine({defaultLayout:'main'}))
        app.set('view engine', 'handlebars')
    //Public
        app.use(express.static(path.join(__dirname,'public')))
    //Middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.user = req.user || null
            next()
        })
    //BodyParser
        app.use(bodyParser.urlencoded({extended:true}))
        app.use(bodyParser.json())
    //Mongoose
        mongoose.Promise = global.Promise
            mongoose.connect(db.mongoRUI).then(()=>{
                console.log('Connected to MongoDB.')
            }).catch((error)=>{
                console.log('An error has been ocurred '+ error)
            })
        


app.get('/home',(req,res)=>{
    res.render('index')
})

app.get('/',(req,res)=>{
    res.redirect('/home')
})

app.use('/admin', admin)
app.use('/users', users)

//Config porta
    const PORT = (process.env.PORT || 8081)
    app.listen(PORT,(req,res)=>{
        console.log('Starting server...')
    })