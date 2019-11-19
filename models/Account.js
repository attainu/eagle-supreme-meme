const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    securityQuestion: {
        type: String,
        required: true
    },
    securityAnswer: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: (new Date())
    }
}, {
    collection: 'accounts'
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;