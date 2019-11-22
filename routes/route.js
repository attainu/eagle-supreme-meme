const authController = {};
const Model = require('./../models/model.js');
const tinify = require("tinify");
var ObjectID = require('mongodb').ObjectID
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


// save the reactions
authController.like = function (req, res) {
    var data = req.body;
    console.log(data.like);
    if (!(req.session.user)) {
        return res.send('First login');
    }
    var collection = db.collection('reactions');
    collection.find({}).toArray(function (err, response) {
        console.log(response)
        if (response.length === 0) {
            collection.insertOne({
                accountId: req.session.user[0]._id,
                postId: req.body.postId,
                like: req.body.like
            }, function (error, response) {
                console.log("1")
                if (error) {
                    return res.send(error)
                } else {
                    return res.send("done")
                }
            });
        } else {

            var exists = null
            for (var i = 0; i < response.length; i++) {
                console.log('1')
                console.log(response[i].postId, req.body.postId, response[i].accountId, req.session.user[0]._id)
                if (response[i].accountId !== req.session.user[0]._id) {
                    console.log("2")
                    exists = false
                }
                if (response[i].accountId === req.session.user[0]._id) {
                    console.log("3.1");
                    if (response[i].postId === req.body.postId) {
                        console.log("3")
                        exists = true
                        break;
                    } else {
                        exists = false
                    }
                }
                console.log(exists)
            };
            if (exists === false) {
                collection.insertOne({
                    accountId: req.session.user[0]._id,
                    postId: req.body.postId,
                    like: req.body.like
                }, function (error, response) {
                    console.log("1")
                    if (error) {
                        return res.send(error)
                    } else {
                        return res.send("done")
                    }
                })
            } else {
                collection.updateOne({
                    accountId: req.session.user[0]._id,
                    postId: req.body.postId
                }, {
                    $set: {
                        like: req.body.like
                    }
                }, function (err, result) {
                    if (!err) {
                        console.log("2")
                        return res.send("done")
                    }
                    //  console.log(result)
                })
            }
        }
    })
}

// like or reaction count 
authController.likeCount = function (req, res) {
    console.log("working" + req.body);
    var collectionLike = db.collection('reactions');
    var collectionPost = db.collection('post');
    collectionLike.find({}).toArray(function (err, response) {
        var count = 0;
        response.forEach(function (value, index) {
            if (value.postId === req.body.postId) {
                if (value.like === "true") {
                    ++count
                }
            }
        })
        console.log(count);

        collectionPost.updateOne({
            _id: ObjectID(req.body.postId)
        }, {
            $set: {
                like: count
            }
        }, function (err, response) {
            if (!err) {
                return res.send(JSON.stringify(count))
            }
        })
    });
}


// authController.signIn = function (request, response) {
//     var data = request.body
//     var session = request.session;
//      console.log(data)
//     Model.signIn(data, session, function (err, message) {
//         if (err) {
//             return response.render('login', {
//                 error: err
//             })
//         } else {
//             if (message !== "logged in") {
//                 response.render('login', {
//                     pass: ("Password:" + message)
//                 })
//             } else {
//                 return response.redirect('/');
//             }
//         }
//     })
// }

authController.upload = async function (request, response) {

    var data = request.body;

    const file = request.file
    console.log(file.path);
    //console.log(data.category);

    //tiinify
    const source = await tinify.fromFile("file.path");
    source.toFile("optimized.png");
    //console.log(source);
    var newfile = file.path.replace("public", "");

    var finalImg = {
        image: newfile,
        category: data.category
    };
    console.log(finalImg);


    //store to db
    var collection = db.collection('approval_pending');
    collection.insertOne(finalImg, function (error, res) {
        if (error) {
            return error
        }

        return response.send('info uploaded, redirecting....');
        // response.redirect("/")
    });
}

authController.checkIfLoggedIn = function (req, res, next) {

    //   console.log("check session " + req.session.user);
    //  console.log("Url " + req.originalUrl);
    if (req.originalUrl !== '/logoutpage' && req.originalUrl !== '/upload') {
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
    //console.log(req.session.user);
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

authController.adminLoginPage = function (req, res) {
    res.render('adminlogin', {
        layout: "admin.hbs"
    });
}
authController.adminAuthentication = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    Model.adminAuthentication(username, password, function (error, success) {
        if (error) {
            return res.json({
                status: 400,
                message: error
            });
        }
        req.session.user = true;
        return res.json({
            status: "200",
            message: success
        });

    });
}


authController.adminLogout = function (req, res) {
    if (req.session.user) {
        req.session.destroy(function (err) {
            if (err) {
                next(err)
            } else {
                res.clearCookie('assignment')
                return res.redirect('/admin');
            }
        });
    } else return res.redirect('/admin');
}
authController.adminDashboard = function (req, res) {
    if (req.session.user) {
        Model.adminApproval(function (error, success) {
            if (error) {
                return res.render(error);
            }
            //console.log(success);
            return res.render('dashboard', {
                layout: "admindashboard",
                data: success
            })
        })

    } else return res.redirect("/admin");

}
authController.adminPostApproval = function (req, res) {
    console.log(req.body);
    Model.adminPostApproval(req.body, function (error, success) {
        res.send({
            status: 200,
            message: success
        });

    });
}
authController.adminPostDecline = function (req, res) {
    //console.log(req.body);
    Model.adminPostDecline(req.body, function (error, success) {
        res.send({
            status: 200,
            message: success
        });

    });
}

module.exports = authController;