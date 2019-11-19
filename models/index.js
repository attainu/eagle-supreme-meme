const mongoose = require('mongoose');

const account = require('./Account.js');

function connect() {
    return mongoose.connect('mongodb://localhost:27017/meme-hub', { useNewUrlParser: true});
}

module.exports = {
    models: {
        User: account
    },
    connect: connect
};