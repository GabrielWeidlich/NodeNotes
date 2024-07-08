const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Users = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    eAdmin:{
        type:Number,
        default: 0
    }
})

mongoose.model('Users', Users)