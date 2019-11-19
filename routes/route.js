const authController = {};
const Model = require('./../models/model.js');
const tinify = require("tinify");
tinify.key = "FGssXbLPvZT54cncJw9CGsjrX807xzYW";
// tinify.fromFile("unoptimized.png").toFile("optimized.png");

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
            return response.render('login', {
                error: err
            })
        } else {
            if (message !== "logged in") {
                response.render('login', {
                    pass: ("Password:" + message)
                })
            } else {
                return response.redirect('/');
            }
        }
    })
}

authController.upload = async function (request, response) {

    var data = request.body;
    
    const file = request.file;
    const destination = '/tmp/'+request.file.path;
    var source = await tinify.fromFile(request.file.path);
     await source.toFile(destination);
    var finalImg = {
        image: file.path,
        category: data.category
    };

    //store to db
    var collection = db.collection('approval_pending');
    collection.insertOne(finalImg, function  (error, res) {
        if (error) {
            return error
        }
        return response.send('info uploaded, redirecting....');
        // response.redirect("/")
    });
}

authController.checkIfLoggedIn = function (req, res, next) {

    // console.log("check session " + typeof req.session.user);
    // console.log("Url " + req.originalUrl);
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

authController.search = function(req,res){
    console.log(req.query);
    //return res.send(req.query);
    var search = req.query.search
    Model.search(search,function(error,success){
        if(error){
            return res.render('search',{
                data:error
            })
        }
        return res.render('search',{
            data:success
        })

})
}
authController.trending = function(req,res){
    Model.trending(function(error,success){
        if(error){
            return res.render('trending',{
                data:error
            })
        }
        return res.render('trending',{
            data:success
        })
    })
}

module.exports = authController;