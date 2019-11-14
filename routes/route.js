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
  // console.log(data)
    Model.signIn(data, response, function (err, message) {
        if (err) {
            return response.send(err)
        } else {
            return response.redirect('/');
        }
    })
}


module.exports = authController;