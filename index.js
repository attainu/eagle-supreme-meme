const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
// const session = require('express-session');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

//middelwares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//handlebars
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

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

var link = [{"image":"https://i.kym-cdn.com/photos/images/newsfeed/001/248/399/430.png"},
            {"image":"https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme-1024x576-1497986561.jpg"},
            {"image":"https://i.kym-cdn.com/photos/images/newsfeed/001/248/399/430.png"},
            {"image":"https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme-1024x576-1497986561.jpg"}
]

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

app.get('/',function(req,res){
    res.render('home',{
        data: link
    });
});
app.get('/loginpage',function(req,res){
    res.render('login');
})

app.listen(9091, function () {
  console.log('app on 9091');
})

