const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Posts = new Schema({
    title: {
        type: string,
        require: true
    },
    description: {
        type: string,
        require: true
    },
    content: {
        type: string,
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
        require: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('Posts', Posts)