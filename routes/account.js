const Account = require('../models/Account.js');
var bcrypt = require('bcryptjs');

const accountController = {};

accountController.signUp = function (req, res) {
    var data = req.body;
    //var hashpassword
    bcrypt.genSalt(10, function(err, salt) {
         bcrypt.hash(data.password, salt, function(err, hash) {
            Account.create({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                userName: data.userName,
                password: hash,
                securityQuestion: data.securityQuestion,
                securityAnswer: data.securityAnswer
            }, function (err, response) {
                if (err) {
                    console.log(err)
                    return res.send("Data already exists")
                }
                return res.redirect('/')
            })
        });
        
    });
    //console.log(hashpassword);

   
}

accountController.signIn = function (req, res) {
    var data = req.body

    Account.find({
        userName: data.userName,
        password: {
            $eq: data.password
        }
    }, function (err, docs) {
        var user = docs
        console.log(user);
        if (user.length > 0) {
            //create session 
            req.session.user = user;
            return res.redirect('/');
        } else {
            Account.find({
                userName: data.userName,
                securityQuestion: data.securityQuestion,
                securityAnswer: data.securityAnswer
            }, function (err, docs) {
                if (docs.length > 0) {
                    return res.render('login', {
                        pass: ("Password:" + JSON.stringify(docs[0].password))
                    }) 
                } else {
                    return res.render('login', {
                            error: "Data does not exists"
                    })
                }
            })
        }
    })
};

module.exports = accountController;