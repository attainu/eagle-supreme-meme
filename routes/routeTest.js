const authController = {};
const Model = require('./../models/model.js');
const fs = require('fs');
var ObjectId = require('mongodb').ObjectID;
const tinify = require("tinify");
tinify.key = "FGssXbLPvZT54cncJw9CGsjrX807xzYW";
// tinify.fromFile("unoptimized.png").toFile("optimized.png");

//multer
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file);
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})



//cloudinary
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'dogn8cjzk',
    api_key: '685335288353771',
    api_secret: '8_cp8VJqpOgKTdto4wjKSKxSDT4'
})

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
var urlLink;
authController.upload = function (req, response) {
    console.log(req.body);
    //cloudinary
    var collection = db.collection('approval_pending');
    cloudinary.uploader.upload(req.file.path, function (error, res) {
        if (!error) {
            urlLink = res.url;
            var finalImg = {
                contentType: req.file.mimetype,
                title : req.body.title,
                tag : req.body.tag,
                likes : 0,
                imageURL: urlLink
            };
            console.log("res>>", res.url);
            collection.insertOne(finalImg, function (error, result) {
                var insertedImgId = result.insertedId;
                // console.log(insertedImgId);

                link.push({ image: `http://localhost:9094/photos/"${insertedImgId}"` });
                if (error) {
                    return error
                }
                // return response.send('info uploaded, redirecting....');
                return response.redirect("/")
            });

        }
        // console.log("err>>>>", error)
    })


    // var img = fs.readFileSync(req.file.path);
    // // link.push({image:'http://localhost:9094/photos/"5dd541039b4e983a8917f6d3"'});

    // // console.log(link)
    // var encode_image = img.toString('base64');
    // // var data = request.body;
    // var finalImg = {
    //     contentType: req.file.mimetype,
    //     imageURL: urlLink
    // };
    // // const file = request.file;
    // // const destination = '/tmp/'+request.file.path;
    // // var source = await tinify.fromFile(request.file.path);
    // //  await source.toFile(destination);


    // //store to db
    // var collection = db.collection('approval_pending');
    // collection.insertOne(finalImg, function (error, result) {
    //     var insertedImgId = result.insertedId;
    //     // console.log(insertedImgId);

    //     link.push({ image: `http://localhost:9094/photos/"${insertedImgId}"` });
    //     if (error) {
    //         return error
    //     }
    //     // return response.send('info uploaded, redirecting....');
    //     response.redirect("/")
    // });
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



authController.home = function (req, res) {
    // console.log(req.session.user);
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

authController.search = function (req, res) {
    console.log(req.query);
    //return res.send(req.query);
    var search = req.query.search
    Model.search(search, function (error, success) {
        if (error) {
            return res.render('search', {
                data: error
            })
        }
        return res.render('search', {
            data: success
        })

    })
}
authController.trending = function (req, res) {
    Model.trending(function (error, success) {
        if (error) {
            return res.render('trending', {
                data: error
            })
        }
        return res.render('trending', {
            data: success
        })
    })
}
// var filename = 1;
authController.renderimage = function (req, res) {
    // db.collection('approval_pending').find().toArray((err, result) => {

    //     const imgArray= result.map(element => element._id);
    //           for (i=0;i<result.length;i++){
    //               console.log(result[i].image);
    //             }
    //             // res.send(result[i].image)

    //  if (err) return console.log(err)
    //  res.send(imgArray)

    // })
    var filename = JSON.parse(req.params.id);
    // console.log(filename);
    db.collection('approval_pending').findOne({ "_id": ObjectId(filename) }, (err, result) => {
        // link.push({"image":'http://localhost:9094/photos/"5dd605e3063bc9625af530a9"'});
        if (err) return console.log(err)

        res.contentType('image/jpeg');
        res.send(result.image.buffer);


    })
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
},
{
    "image": 'http://localhost:9094/photos/"5dd605e3063bc9625af530a9"'
}
]

module.exports = authController;