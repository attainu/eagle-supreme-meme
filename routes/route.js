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
var pass = encodeURIComponent('meme-hub@6')
var url = 'mongodb+srv://root:' + pass + '@meme-hub-vxtlu.mongodb.net/meme-hub?retryWrites=true&w=majority';
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

//cloudinary
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'memehubeagle',
    api_key: '746724469249981',
    api_secret: 'wrCdY-SrNtq4DrzuUbVQ-3bKhOY'
})

authController.checkIfLoggedIn = function (req, res, next) {
    //     console.log('This is request'+ req)
    //   console.log("check session " + req.session.user);
    //  console.log("Url " + req.originalUrl);
    if (req.originalUrl !== '/logoutpage' && req.originalUrl !== '/upload') {
        return next();
    } else {
        if (req.session.user === undefined) {
            req = null;
            //      console.log("Session Error")
            res.redirect("/loginpage");
            //     console.log("After response")
        } else {
            return next();
        }
    }
}


// save the reactions
authController.like = function (req, res) {
    var data = req.body;
    // console.log(data.like);
    if (!(req.session.user)) {
        return res.send('First login');
    }
    var collection = db.collection('reactions');
    collection.find({
        $and: [{
                postId: req.body.postId
            },
            {
                accountId: req.session.user[0]._id
            }
        ]
    }).toArray(function (err, response) {
        //  console.log(response)
        if (response.length === 0) {
            collection.insertOne({
                accountId: req.session.user[0]._id,
                postId: req.body.postId,
                like: req.body.like
            }, function (error, response) {
                // console.log("1")
                if (error) {
                    return res.send(error)
                } else {
                    return res.send("done")
                }
            });
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
                    //  console.log("2")
                    return res.send("done")
                }
            })
        }
    })
}

// like or reaction count 
authController.likeCount = function (req, res) {
    //  console.log("working" + req.body);
    var collectionLike = db.collection('reactions');
    var collectionPost = db.collection('post');
    collectionLike.find({
        $and: [{
                postId: req.body.postId
            },
            {
                like: "true"
            }
        ]
    }).toArray(function (err, response) {
        console.log(response);
        var count = response.length
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

// get comments 
authController.getComment = function (req, res) {
    console.log(req.body);
    var collection = db.collection('comments');
    var commentArray = []
    collection.find({}).toArray(function (err, response) {
        if (response.length > 0) {
            console.log(response[0].postId)
            for (let i = 0; i < response.length; i++) {
                if (response[i].postId === req.body.postId) {
                    commentArray.push(response[i]);
                }
            }
        }
        console.log(commentArray)
        return res.send(commentArray);
    })
}

// save comments
authController.saveComment = function (req, res) {
    console.log(req.body);
    var collection = db.collection('comments');
    if (!(req.session.user)) {
        return res.send('First login');
    } else {
        collection.insertOne({
            accountId: req.session.user[0]._id,
            accountName: req.session.user[0].userName,
            postId: req.body.postId,
            comment: req.body.comment
        }, function (error, response) {
            console.log("1")
            if (error) {
                return res.send(error)
            } else {
                return res.send([req.session.user[0].userName, req.body.comment])
            }
        })
    }
}

var urlLink;
authController.upload = function (req, response) {
    console.log(req.body);
    console.log(req.file);
    console.log(req.file.path);
    //cloudinary
    var collection = db.collection('approval_pending');
    cloudinary.uploader.upload(req.file.path, function (error, res) {
        console.log("this the cloudinary Error" + error)
        if (!error) {
            urlLink = res.url;
            var finalImg = {
                title: req.body.title,
                tag: req.body.tag,
                like: 0,
                url: urlLink,
                name: req.session.user[0].userName,
                userupload: "true"
            };
            console.log("res>>", res.url);
            collection.insertOne(finalImg, function (error, result) {
                console.log("inserting error" + error)
                if (error) {
                    return response.send(error)
                } else {
                    return response.send("done")
                }
            });

        } else {
            response.send(error)
        }
        // console.log("err>>>>", error)
    })


}

authController.explore = function (req, res) {
    var request = req;
    var response = res;

    Model.checkLike(request, response, function (err, doc) { //   check like  
        if (!err) {
            //  console.log(doc);
            var posts = []
            Model.explore(function (error, success) {
                //   console.log(success);

                if (doc) {
                    success.forEach(element => {
                        doc.forEach(id => {
                            if (JSON.stringify(id.postId) === JSON.stringify(element._id)) {
                                element.show = true
                                // console.log(element);
                            } //else {console.log(element._id)}
                        })
                        posts.push(element)
                    });
                } else {
                    posts = success
                }
                // console.log(posts);

                if (error) {
                    return res.render('home', {
                        data: error
                    })
                }
                if (typeof req.session.user == "undefined") {
                    return res.render('home', {
                        data: posts,
                        logIn: "<a href='/loginpage'>Login/Signup </a>"
                    });
                } else {
                    return res.render('home', {
                        data: posts,
                        logIn: "<a href='/logoutpage'>Logout</a>"
                    });
                }
                //return res.render('trending',{
                //  data:success
                //})
            })
        }
    })
}

authController.home = function (req, res) {
    var request = req;
    var response = res;

    Model.checkLike(request, response, function (err, doc) { //   check like  
        if (!err) {
            //  console.log(doc);
            var posts = []
            Model.home(function (error, success) {
                //   console.log(success);

                if (doc) {
                    success.forEach(element => {
                        doc.forEach(id => {
                            if (JSON.stringify(id.postId) === JSON.stringify(element._id)) {
                                element.show = true
                                // console.log(element);
                            } //else {console.log(element._id)}
                        })
                        posts.push(element)
                    });
                } else {
                    posts = success
                }
                // console.log(posts);

                if (error) {
                    return res.render('home', {
                        data: error
                    })
                }
                if (typeof req.session.user == "undefined") {
                    return res.render('home', {
                        data: posts,
                        logIn: "<a href='/loginpage'>Login/Signup </a>"
                    });
                } else {
                    return res.render('home', {
                        data: posts,
                        logIn: "<a href='/logoutpage'>Logout</a>"
                    });
                }
                //return res.render('trending',{
                //  data:success
                //})
            })
        }
    })
}
authController.whatsnew = function (req, res) {
    var request = req;
    var response = res;

    Model.checkLike(request, response, function (err, doc) { //   check like  
        if (!err) {
            //  console.log(doc);
            var posts = []
            Model.whatsnew(function (error, success) {
                //   console.log(success);

                if (doc) {
                    success.forEach(element => {
                        doc.forEach(id => {
                            if (JSON.stringify(id.postId) === JSON.stringify(element._id)) {
                                element.show = true
                                // console.log(element);
                            } //else {console.log(element._id)}
                        })
                        posts.push(element)
                    });
                } else {
                    posts = success
                }
                // console.log(posts);

                if (error) {
                    return res.render('whatsnew', {
                        data: error
                    })
                }
                if (typeof req.session.user == "undefined") {
                    return res.render('whatsnew', {
                        data: posts,
                        logIn: "<a href='/loginpage'>Login/Signup </a>"
                    });
                } else {
                    return res.render('whatsnew', {
                        data: posts,
                        logIn: "<a href='/logoutpage'>Logout</a>"
                    });
                }
                //return res.render('trending',{
                //  data:success
                //})
            })
        }
    })
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
    var request = req;
    var response = res;

    Model.checkLike(request, response, function (err, doc) { //   check like  
        if (!err) {
            //  console.log(doc);
            var posts = []
            Model.search(search, function (error, success) {
                if (doc) {
                    success.forEach(element => {
                        doc.forEach(id => {
                            if (JSON.stringify(id.postId) === JSON.stringify(element._id)) {
                                element.show = true
                                // console.log(element);
                            } //else {console.log(element._id)}
                        })
                        posts.push(element)
                    });
                } else {
                    posts = success
                }

                if (error) {
                    return res.render('search', {
                        data: error
                    })
                }
                if (typeof req.session.user == "undefined") {
                    return res.render('home', {
                        data: success,
                        logIn: "<a href='/loginpage'>Login/Signup </a>"
                    });
                } else {
                    return res.render('home', {
                        data: success,
                        logIn: "<a href='/logoutpage'>Logout</a>"
                    });
                }
                //return res.render('search',{
                //data:success
                //})

            })
        }
    })
}
authController.trending = function (req, res) {
    var request = req;
    var response = res;

    Model.checkLike(request, response, function (err, doc) { //   check like  
        if (!err) {
            //  console.log(doc);
            var posts = []
            Model.trending(function (error, success) {
                //   console.log(success);

                if (doc) {
                    success.forEach(element => {
                        doc.forEach(id => {
                            if (JSON.stringify(id.postId) === JSON.stringify(element._id)) {
                                element.show = true
                                // console.log(element);
                            } //else {console.log(element._id)}
                        })
                        posts.push(element)
                    });
                } else {
                    posts = success
                }
                // console.log(posts);

                if (error) {
                    return res.render('home', {
                        data: error
                    })
                }
                if (typeof req.session.user == "undefined") {
                    return res.render('home', {
                        data: posts,
                        logIn: "<a href='/loginpage'>Login/Signup </a>"
                    });
                } else {
                    return res.render('home', {
                        data: posts,
                        logIn: "<a href='/logoutpage'>Logout</a>"
                    });
                }
                //return res.render('trending',{
                //  data:success
                //})
            })
        }
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
        };
        var user = [{
            "_id": 23848234,
            "userName": username,
            "password": password

        }];
        req.session.user = user;
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
    var checkAdmin = [{
        "_id": 23848234,
        "userName": "admin",
        "password": "admin"
    }];
    if (req.session.user) {
        console.log("ok");
        if (req.session.user[0]._id === checkAdmin[0]._id && req.session.user[0].userName === checkAdmin[0].userName) {

            console.log(req.session.user);
            Model.adminApproval(function (error, success) {
                if (error) {
                    return res.render(error);
                }
                //console.log(success);
                return res.render('dashboard', {
                    layout: "admindashboard",
                    data: success
                })
            });
        } else return res.redirect("/admin");
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
authController.adminReported = function (req, res) {
    var checkAdmin = [{
        "_id": 23848234,
        "userName": "admin",
        "password": "admin"
    }];
    if (req.session.user) {
        console.log("ok");
        if (req.session.user[0]._id === checkAdmin[0]._id && req.session.user[0].userName === checkAdmin[0].userName) {

            console.log(req.session.user);
            Model.adminReported(function (error, success) {
                if (error) {
                    return res.render(error);
                }
                //console.log(success);
                return res.render('report', {
                    layout: "admindashboard",
                    data: success
                })
            });
        } else return res.redirect("/admin");
    } else return res.redirect("/admin");

}


authController.adminReportedPost = function (req, res) {
    Model.adminReportedPost(req.body, function (error, success) {
        res.send({
            status: 200,
            message: success
        })
    })
}
authController.adminReview = function (req, res) {
    Model.adminReview(req.body, function (error, success) {
        res.send({
            status: 200,
            message: success
        })
    })
}
authController.adminDelete = function (req, res) {
    Model.adminDelete(req.body, function (error, success) {
        res.send({
            status: 200,
            message: success
        })
    })
}
authController.wishList = function (req, res) {
    if (req.session.user) {
        var collection = db.collection('wishlist');
        collection.find({
            $and: [{
                accountId: req.session.user[0]._id
            }, {
                postId: req.body.id
            }]
        }).toArray(function (err, success) {
            if (err) {
                return res.send(err);
            }
            if (success.length < 1) {
                collection.insertOne({
                    accountId: req.session.user[0]._id,
                    accountName: req.session.user[0].userName,
                    postId: req.body.id,
                });
                return res.send("Saved");

            } else return res.send("Already Saved");
        })

        //console.log(req.session.user);

    } else return res.send("Login");
}


authController.getWishList = function (req, res) {
    if (req.session.user) {
        var request = req;
        var response = res;
        var database = [];
        var collection1 = db.collection('wishlist');
        var collection2 = db.collection('post');
        Model.checkLike(request, response, function (err, doc) {
            if(!err){
            var posts = []
        collection1.find({
            accountId: req.session.user[0]._id
        }).toArray(async function (error, success) {
            if (error) {
                return res.send(error);
            } else {
                success.forEach(function (id) {
                    collection2.find({
                        _id: ObjectID(id.postId)
                    }).toArray(function (err, suc) {
                        if(suc.length === 0){
                           return res.render('save', {
                                data: posts,
                                logIn: "<a href='/logoutpage'>Logout</a>"
                            });
                        } else {
                        database.push(suc[0]);
                        console.log(database);
                        if (database.length === success.length) {
                            if (doc) {
                                database.forEach(element => {
                                    doc.forEach(id => {
                                        if (JSON.stringify(id.postId) === JSON.stringify(element._id)) {
                                            element.show = true
                                            // console.log(element);
                                        } //else {console.log(element._id)}
                                    })
                                    posts.push(element)
                                });
                            } else {
                                posts = database
                            }
                            return res.render('save', {
                                data: posts,
                                logIn: "<a href='/logoutpage'>Logout</a>"
                            });
                        }
                    }
                    });
                })
            }
        })
    }
    })
    } else {
        return res.redirect('/loginpage')
    }
}
authController.deleteWishList = function (req, res) {
    if (req.session.user) {
        var collection = db.collection('wishlist');
        collection.deleteOne({
            $and: [{
                    postId: req.body.id
                },
                {
                    accountId: req.session.user[0]._id
                }
            ]
        }, function (err, success) {
            if (err) {
                return res.send(err);
            } else return res.send("deleted");
        })
    }
}

module.exports = authController;