const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    accountId: {
        type: String,
      //  required: true,
        unique:true
    },
    postId: {
        type: String,
        required: true
    },
    like: {
        type: Boolean,
        required: true,           
    },
    createdAt: {
        type: Date,
        default: (new Date())
    }
}, {
    collection: 'reactions'
});

const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;