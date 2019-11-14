const authController = {};
const Model = require('./../models/model.js');


// controllers 
authController.signUp = function (request, response) {
    var data = request.body;
    Model.singUp(data, response, function(err, message){
        if (err){
            return response.send(err)
        } else {
            return response.send(message)
        }
    })
}

authController.signIn = function (request, response) {
    var data = request.body
    
    Model.signIn(data, response, function(err, message){
        if (err){
            return response.send(err)
        } else {
            return response.send(message)
        }
    })
  }

module.exports = authController;