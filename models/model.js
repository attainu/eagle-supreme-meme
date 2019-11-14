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
    collection.find({}).toArray(function (err, res) {
      // console.log(err);
      // console.log(res);
    })
    //   client.close();
  }
});


AuthModel.singUp = function(req, res, cb){

    var collection = db.collection('accounts');
    collection.insertOne(req, function (error, response) {
      if (error) {
        return cb(error)
      }
      console.log();
      return cb(null, "created user")
    });
}


AuthModel.signIn = function(req, res, cb){

    var collection = db.collection('accounts');
    collection.find({}).toArray(function (err, response) {
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
      if (!user) {
        return cb("data does not match")
      } else {
        return cb(null, "logged in")
      }
    })
}

module.exports = AuthModel;