const Reaction = require('../models/Reaction.js');

const reactionController = {};

reactionController.like = function (req, res) {
    console.log("1");
    console.log(req.body.like, req.body.postId)
  //  console.log(Reaction.find({postId: req.body.postId}))
    Reaction.create({
        postId: req.body.postId,
        like: req.body.like,
    }, function(err, response){
        if (err){
            console.log("2")
            Reaction.findOneAndUpdate({postId: req.body.postId},{like: req.body.like}, function(err, response){
                if (!err){
                    console.log("done");
                }
            })
        }
    })
    Reaction.find({postId: req.body.postId}, function(err, response){
        console.log(response);
    })
}

module.exports = reactionController;