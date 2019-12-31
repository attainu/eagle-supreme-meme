const mongoose = require('mongoose');

const account = require('./Account.js');
var pass = encodeURIComponent('meme-hub@6')
var url = 'mongodb+srv://root:'+pass+'@meme-hub-vxtlu.mongodb.net/meme-hub?retryWrites=true&w=majority';

function connect() {
    return mongoose.connect(url,  { useNewUrlParser: true, useCreateIndex:true});
}

module.exports = {
    models: {
        User: account,
    },
    connect: connect
};