const Account = require('../models/Account.js');

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const accountController = {};

accountController.signUp = function (req, res) {
    var data = req.body;
    if (data.password !== data.conPassword) {
        return res.send('Password and Confirm Password do not match')
    } else {
        //var hashpassword
        bcrypt.hash(data.password, saltRounds, function (err, hash) {
            if (!err) {
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
                        //  console.log(err)
                        return res.send("This user already exists, Try different user name or e-mail")
                    }
                    req.session.user = [response];
                    return res.send('New Account created')
                })
            }
        });
    }
}

accountController.signIn = function (req, res) {
    var data = req.body

    Account.find({
        userName: data.userName
    }, function (err, docs) {
        var user = docs
        console.log(user);
        if (user.length > 0) {
            bcrypt.compare(data.password, user[0].password, function (err, response) {
                if (response == true) {
                    //create session 
                    req.session.user = user;
                    return res.send('Logged-in');
                } else {
                    return res.send('Incorrect Password')
                }
            });
        } else {
            return res.send('Incorrect Username')
        }
    })
};

accountController.forPass = async function (req, res) {
    var data = req.body;
    bcrypt.hash(data.newPassword, saltRounds, function (err, hash) {
        if (!err) {
            Account.findOneAndUpdate({
                userName: data.userName,
                securityQuestion: data.securityQuestion,
                securityAnswer: data.securityAnswer,
            }, {
                $set: {
                    password: hash
                }
            }, {
                new: true
            }, (err, doc) => {
                if (doc === null) {
                    return res.send("Wrong Input")
                } else {
                    return res.send("done")
                }
            });
        } else { 
            return res.send(err);
        }
    })
}

module.exports = accountController;