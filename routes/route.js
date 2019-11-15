const authController = {};
const Model = require('./../models/model.js');


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
            logIn: "<a href='/loginpage'>Login </a>"
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

module.exports = authController;