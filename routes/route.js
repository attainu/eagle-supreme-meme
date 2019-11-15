const authController = {};
const Model = require('./../models/model.js');

// mongo db
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
var db = null;
var url = 'mongodb://localhost:27017';
MongoClient.connect(url, function (err, client) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established from routes to', url);
        db = client.db('meme-hub');
        var collection = db.collection('accounts');
        collection.find({}).toArray(function (err, res) {
            // console.log(err);
           //  console.log(res);
        })
        //   client.close();
    }
});


// controllers 
authController.signUp = function (request, response) {
    var data = request.body;
    //console.log(data);
    Model.singUp(data, response, function (err, message) {
        if (err) {
            return response.send(err)
        } else {
            return response.redirect('/');
        }
    })
}

authController.signIn = function (request, response) {
    var data = request.body
  // console.log(data)
    Model.signIn(data, response, function (err, message) {
        if (err) {
            return response.send(err)
        } else {
            return response.redirect('/');
        }
    })
}
authController.upload = function (request, response) {
    // console.log('hi');
    res.send('file');
    var data = request.body;
    console.log(data);
    const file = request.file
    console.log(file);
    var collection = db.collection('uploads');
    collection.insertOne(data, function (error, res) {
        if (error) {
            return error
        }
        // console.log(res)
        return response.send('info uploaded');
    });
}


module.exports = authController;