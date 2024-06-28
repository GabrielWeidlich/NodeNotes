if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoRUI: 'colocar aqui a URL do heroku'}
}else{
    module.exports = {mongoRUI: 'mongodb://localhost:/nodenotes'}
}