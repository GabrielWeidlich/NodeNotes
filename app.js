const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const hdbrs = require('handlebars')
const path = require('path')
const admin = require('./routes/admin')
const bodyParser = require('body-parser')
const { default: mongoose } = require('mongoose')
require('./models/Categories')
const Category = mongoose.model('Categories')
require('./models/Posts')
const Posts = mongoose.model('Posts')
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
hdbrs.registerHelper('ifEqual', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
app.engine('handlebars', handlebars.engine({ 
    defaultLayout: 'main',
    runtimeOptions:{
        allowProtoPropertiesByDefault:true,
        allowProtoMethodsByDefault: true
    }
}))
app.set('view engine', 'handlebars')

//Public
app.use(express.static(path.join(__dirname, 'public')))

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//BodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Mongoose
mongoose.Promise = global.Promise
mongoose.connect(db.mongoRUI).then(() => {
    console.log('Connected to MongoDB.')
}).catch((error) => {
    console.log('An error has been ocurred ' + error)
})

app.get('/', (req, res) => {
    res.redirect('/home')
})


app.get('/home', (req, res) => {
     Posts.find().lean().populate('category').sort({ data: 'desc' }).then((posts) => {
        res.render('index', { posts: posts })
    }).catch((error) => {
        req.flash("error_msg", "An erros has been ocurred " + error)
        res.render('index')
    })
})

app.get('/categories',(req,res)=>{
    Category.find().lean().then((categories)=>{
        res.render('categories/index',{categories:categories})
    }).catch((error)=>{
        req.flash('error_msg',"An erros has been ocurred " + error)
        res.redirect('/home')
    })
})

app.get('/categories/:slug', (req, res) => {
    Category.findOne({ slug: req.params.slug }).lean().then((category) => {
        if (category) {
            Posts.find({ category: category._id }).lean().then((posts) => {
                res.render('categories/posts', { posts: posts, category: category })
            }).catch((error) => {
                req.flash('error_msg', app.get('/categorias',(req,res)=>{
                    Category.find().lean().then((categories)=>{
                        res.render('categorias/index',{categorias:categories})
                    }).catch((error)=>{
                        req.flash('error_msg',"An erros has been ocurred " + error)
                        res.redirect('/')
                    })
                })
            )})
        } else {
            req.flash('error_msg', 'This category cannot be found or does not exist.')
            res.redirect('/')
        }
    }).catch((error) => {
        req.flash('error_msg', 'An error has been ocurred ' + error)
        res.redirect('/')
    })
})

app.get('/posts/:slug',(req,res)=>{
    Posts.findOne({slug:req.params.slug}).lean().then((posts)=>{
        if(posts){
            res.render('posts/index',{posts: posts})
        }else{
            req.flash("error_msg",'This post cannot be found or does not exist.')
            res.redirect('/')
        }
    }).catch((error)=>{
        req.flash('error_msg','An error has been ocurred ' + error)
        res.redirect('/')
    })
})

app.use('/admin', admin)
app.use('/users', users)

//Config porta
const PORT = (process.env.PORT || 8081)
app.listen(PORT, (req, res) => {
    console.log('Starting server...')
})