const authController = {};
const Model = require('./../models/model.js');
const fs = require('fs')

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
    var session = request.session;
    // console.log(data)
    Model.signIn(data, session, function (err, message) {
        if (err) {
            return response.render('login',{
                error: err
            })
        } else {
            return response.redirect('/');
        }
    })
}
authController.upload = function (request, response) {
    // console.log('hi');
    // res.send('file');
    var data = request.body;
    // console.log(data);
    // response.send('hello');

    const file = request.file
    console.log(file.path);
    console.log(data.category);

    var img = fs.readFileSync(request.file.path);
    var encode_image = img.toString('base64'); 
    // console.log(encode_image);
    var finalImg = {
        contentType: request.file.mimetype,
        image:  new Buffer.from(encode_image, 'base64'),
        category: data.category
     };

    var collection = db.collection('approval_pending');
    collection.insertOne(finalImg, function (error, res) {
        if (error) {
            return error
        }
        // console.log(res)
        return response.send('info uploaded, redirecting....');
        // response.redirect("/")
    });
}

authController.checkIfLoggedIn = function (req, res, next) {

    console.log("check session " + typeof req.session.user);
    console.log("Url " + req.originalUrl);
    if (req.originalUrl !== '/logoutpage') {
        return next();
    } else {
        if (typeof req.session.user === "undefined") {
            return res.json({
                status: false,
                message: "Unauthorized request"
            });
        } else {
            return next();
        }
    }
}

var link = [{
    "image": "https://i.kym-cdn.com/photos/images/newsfeed/001/248/399/430.png"
  },
  {
    "image": "https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme-1024x576-1497986561.jpg"
  },
  {
    "image": "https://i.kym-cdn.com/photos/images/newsfeed/001/248/399/430.png"
  },
  {
    "image": "https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme-1024x576-1497986561.jpg"
  }
]

authController.home = function (req, res) {
    console.log(req.session.user);
    if (typeof req.session.user == "undefined") {
        res.render('home', {
            data: link,
            logIn: "<a href='/loginpage'>Login/Signup </a>"
        });
    } else {
        res.render('home', {
            data: link,
            logIn: "<a href='/logoutpage'>Logout</a>"
        });
    }
}

authController.logout = function (req, res) {
    var session = req.session;
    console.log(session);
    session.destroy();
  
    return res.redirect('/');
  }

//authController.search = function(req,res){
   // var search = req.query.search
   // Model.search(search,function(error,success){

////})
//}

module.exports = authController;