const AuthModel = {};

// mongo db
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
var db = null;
var url = 'mongodb://localhost:27017';
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


AuthModel.singUp = function (req, res, cb) {
    //  console.log(req);
    var collection = db.collection('accounts');
    collection.find({}).toArray(function (err, response) {
        console.log(response);
        var user = null;
        response.forEach(function (value, index) {
            if (value.userId === req.userId) {
                user = value;
                return cb("user already exists")
            }
        })
        if (user === null) {
            collection.insertOne(req, function (error, response) {
                if (error) {
                    return cb(error)
                } else {
                    return cb(null, "created user")
                }
            });
        }
    })
}


AuthModel.signIn = function (req, session, cb) {

        var collection = db.collection('accounts');
        collection.find({}).toArray(function (err, response) {

                // console.log(req);
                if (!err) {
                    var user = null;
                    response.forEach(function (value, index) {
                        if (value.userId === req.userId) {
                            if (value.password === req.password) {
                                user = value;
                            }
                        }
                    })
                }
                //console.log(user);
                if (!user) {
                    var answer = null;
                    response.forEach(function (value, index) {
                            if (value.userId === req.userId) {
                                if (value.seqQue === req.seqQue) {
                                    if (value.seqAns === req.seqAns) {
                                        answer = value
                                    }
                                }
                            }
                        })
                        if (!answer){
                            return cb("data does not match")
                        } else {
                            return cb(null, answer.password)
                        }
                    }
                    else {
                        session.user = user;
                        console.log(session.user);
                        return cb(null, "logged in")
                    }
                })
        }
   

AuthModel.search = function(search,cb){
    console.log(search);
    var collection = db.collection('post');
    collection.find({$or:[{title:search},{tags:search}]}).toArray(function (err, res) {
        if(err){
            return cb(err);
        }
        console.log(res);
        return cb(null,res);
    })
}

AuthModel.trending = function(cb){
    var collection = db.collection('post');
    collection.find().sort({like:-1}).toArray(function(err,res){
        if(err){
            return cb(err);
        }
        console.log(res);
        return cb(null,res);
    })
}

        module.exports = AuthModel;