const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Categories = new Schema({
    title: {
        type: String,
        require: true
    },
    slug:{
        type: String,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

mongoose.model('Categories', Categories)