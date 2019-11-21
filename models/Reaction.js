const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    accountId: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    like: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        default: (new Date())
    }
});

const Reaction = mongoose.model('reactions', reactionSchema);

module.exports = Reaction;