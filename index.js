const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const session = require('express-session');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

//middelwares
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//database
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

// login Session
// app.use(session({
//   name: "assignment",
//   secret: 'someRandomStuff',
//   resave: true,
//   saveUninitialized: true,
//   cookie: {
//     httpOnly: true,
//     maxAge: 120000,
//     path: '/',
//     sameSite: true,
//     secure: false
//   }
// }))

//routes
app.post('/signup', function (req, response) {
  var data = req.body;
  console.log(req.body.userId);
  var collection = db.collection('accounts');
  collection.insertOne(data, function (err, res) {
    if (err) {
      console.log(err);
    }
    console.log();
    return response.send('created user');
  })


  // console.log(collection);
});

app.post('/signin', function (request, response) {
  var data = request.body
  console.log(request.body.userId, request.body.password)
  var collection = db.collection('accounts');
  collection.find({}).toArray(function (err, res) {
    if (!err) {
      var user = null;
    res.forEach(function (value, index) {
        if (value.userId === request.body.userId) {
            if (value.password === request.body.password) {
                user = value;
            }
        }
    })
    }
    if (!user){
      return response.send("data does not match")
  } else {return response.send("logged in")}
     console.log(res);
  })
})

app.listen(9091, function () {
  console.log('app on 9091');
})