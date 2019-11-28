const AuthModel = {};
const ObjectId = require('mongodb').ObjectID


// mongo db
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
var db = null;
var pass = encodeURIComponent('meme-hub@6')
var url = 'mongodb+srv://root:'+pass+'@meme-hub-vxtlu.mongodb.net/meme-hub?retryWrites=true&w=majority';
MongoClient.connect(url, function (err, client) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established to', url);
        db = client.db('meme-hub');
        var collection = db.collection('accounts');
        collection.find({}).toArray(function (err, res) {})
    }
});

AuthModel.explore = function (cb) {

    var collection = db.collection('post');
    collection.find({name:"admin"}).limit(15).sort().toArray(function (err, res) {
        if (err) {
            return cb(err);
        }
        //console.log(res);
        return cb(null, res);
    })
}
AuthModel.home = function (cb) {

    var collection = db.collection('post');
    collection.find({name:"admin"}).limit(10).sort({
        _id: -1
    }).toArray(function (err, res) {
        if (err) {
            return cb(err);
        }
        //console.log(res);
        return cb(null, res);
    })
}
AuthModel.whatsnew = function (cb) {

    var collection = db.collection('post');
    collection.find().limit(15).sort({
        _id: -1
    }).toArray(function (err, res) {
        if (err) {
            return cb(err);
        }
        //console.log(res);
        return cb(null, res);
    })
}

AuthModel.search = function (search, cb) {
    console.log(search);
    var collection = db.collection('post');
    collection.find({
        $or: [{
            title: search
        }, {
            tags: search
        }]
    }).toArray(function (err, res) {
        if (err) {
            return cb(err);
        }
        console.log(res);
        return cb(null, res);
    })
}

AuthModel.trending = function (cb) {
    var collection = db.collection('post');
    collection.find().limit(10).sort({
        like: -1
    }).toArray(function (err, res) {
        if (err) {
            return cb(err);
        }
        console.log(res);
        return cb(null, res);
    })
}
var temp = {
    "username": "admin",
    "password": "admin"
};

AuthModel.adminAuthentication = function (username, password, cb) {
    if (!username) {
        return cb("Username Required");
    }
    if (!password) {
        return cb("Password Required");
    }
    if (temp.username == username && temp.password == password) {
        return cb(null, "Verified");
    }
    return cb("Invalid Credentials");
}

AuthModel.adminApproval = function (cb) {
    var collection = db.collection('approval_pending');
    collection.find().toArray(function (err, res) {
        if (err) {
            return cb(err)
        }
        return cb(null, res);
    })

}
AuthModel.adminPostApproval = function (postID, cb) {
    var collection1 = db.collection('approval_pending');
    var collection2 = db.collection('post');
    //console.log(postID.id);
    var newID = ObjectId(postID.id);
    collection1.find({
        _id: newID
    }).toArray(function (err, res) {
        if (err) {
            return cb(err);
        }
        console.log("This is a response", res);
        collection2.insertMany(res);
        collection1.remove({
            _id: newID
        });
        console.log("successful")
        return cb(null, "Accepted");
        //return cb(null,"Successful");

    })


}
AuthModel.adminPostDecline = function (postID, cb) {
    var collection = db.collection('approval_pending');
    // var collection2 = db.collection('post');
    //console.log(postID.id);
    var newID = ObjectId(postID.id);

    collection.remove({
        _id: newID
    });
    console.log("successful")
    return cb(null, "Decline");
    //return cb(null,"Successful");

}
AuthModel.adminReported = function (cb) {
    var collection = db.collection('reported');
    collection.find().toArray(function (err, res) {
        if (err) {
            return cb(err)
        }
        return cb(null, res);
    })

}
AuthModel.adminReportedPost = function (postID, cb) {
    var collection1 = db.collection('reported');
    var collection2 = db.collection('post');
    var newID = ObjectId(postID.id);
    collection2.find({
        _id: newID
    }).toArray(function (err, res) {
        if (err) {
            return cb(err);
        }
        console.log("This is a response", res);
        collection1.insertMany(res);
        return cb(null, "done")


    });

}

AuthModel.adminReview = function (postID, cb) {
    var collection = db.collection('reported');
    var newID = ObjectId(postID.id);
    collection.remove({
        _id: newID
    });
    cb(null, "Review")
}
AuthModel.adminDelete = function (postID, cb) {
    var collection1 = db.collection('reported');
    var collection2 = db.collection('post');
    var newID = ObjectId(postID.id);
    collection1.remove({
        _id: newID
    });
    collection2.remove({
        _id: newID
    });
    cb(null, "Deleted")
}

AuthModel.checkLike = function (req, res, cb) {

    var collection = db.collection('reactions');
    if (req.session.user) {
        var likeAcc = [];
        var userId = req.session.user[0]._id;
        collection.find({}).toArray(function (err, response) {
            response.forEach(element => {
              //  console.log(element)
                if (element.accountId === userId) {
                    if (element.like === "true") {
                        likeAcc.push(element.postId)
                    }
                }
            });
          //  console.log(likeAcc)
            if (!err) {
                return cb(null, likeAcc)
            } else {
                cb(err)
            }
        })
    } else {
        cb(null)
    }
}

module.exports = AuthModel;