const Account = require('../models/Account.js');


const accountController = {};

accountController.signUp = function (req, res) {
    var data = req.body;
    //var hashpassword
    
            Account.create({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                userName: data.userName,
                password: data.password,
                securityQuestion: data.securityQuestion,
                securityAnswer: data.securityAnswer
            }, function (err, response) {
                if (err) {
                    console.log(err)
                    return res.send("This user already exists, Try different user name or e-mail")
                }
                req.session.user = [response];
                return res.send('New Account created')
            })
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