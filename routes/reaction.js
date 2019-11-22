const Reaction = require('../models/Reaction.js');
const mongoose = require('mongoose');

const reactionController = {};


reactionController.like = function (req, res) {
    //console.log("this is session",req.session.user[0]._id);
    // const reaction = new Reaction({
    //  var  acc = req.session.user[0]._id
    //     postId: req.body.postId,
    //     like: req.body.like
    // })
    // reaction.save().then(result => {
    //     console.log(result);
    // }).catch(err => {console.log(err)})
    console.log(mongoose.Types.ObjectId())
    Reaction.create({ 
        _id: req.body.time,
        accountId: "2134",
        postId: "123",
        like: req.body.like,
    }, function(err, response){
        console.log(err,response);
        // if (err){
        //     console.log("2")
        //     Reaction.findOneAndUpdate({postId: req.body.postId},{like: req.body.like}, function(err, response){
        //         if (!err){
        //             console.log("done");
        //         }
        //     })
        // }
    })
    // Reaction.find({postId: req.body.postId}, function(err, response){
    //    console.log(response);
    // })
}

module.exports = reactionController;